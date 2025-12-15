"use client";

import { EditorCommand, EditorCommandEmpty, EditorCommandItem, EditorCommandList, EditorContent, EditorRoot } from "novel";
import { defaultExtensions } from "novel/extensions";
import { slashCommand, starterKit } from "novel/extensions";
import { useState, useCallback } from "react";

interface TextEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

/**
 * Editor de texto usando Novel (Tiptap wrapper)
 * Com suporte a markdown, slash commands e upload de imagens
 * Com limpeza automática de HTML do Word
 */
export function TextEditor({ 
  initialContent = "", 
  onChange,
  placeholder = "Comece a digitar..."
}: TextEditorProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Função para limpar HTML colado do Word
  const cleanWordPastedHTML = useCallback((html: string): string => {
    // Detectar se é HTML do Word
    const isWordContent = /urn:schemas-microsoft-com:office|MsoNormal|mso-style-textfill/.test(html);
    
    if (!isWordContent) return html;

    let cleaned = html;
    
    // Remover tags vazias ou com apenas nbsp
    cleaned = cleaned.replace(/<p[^>]*>(&nbsp;|\s)*<\/p>/gi, '');
    
    // Remover estilos inline que definem line-height, margin fixos
    cleaned = cleaned.replace(
      /style="[^"]*(?:line-height|margin|mso-[^"]*)[^"]*"/gi,
      ''
    );
    
    // Remover classes MsoNormal e similares
    cleaned = cleaned.replace(/class="[^"]*Mso[^"]*"/gi, '');
    cleaned = cleaned.replace(/class="Apple-[^"]*"/gi, '');
    
    // Remover espaços múltiplos
    cleaned = cleaned.replace(/\s{2,}/g, ' ');
    
    return cleaned;
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Erro ao fazer upload da imagem");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-slate-100 border-b border-slate-300 px-4 py-3">
        <h3 className="font-semibold text-slate-900">Editor de Texto</h3>
      </div>

      {/* Editor */}
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={[
            ...defaultExtensions,
            starterKit.configure({
              heading: {
                levels: [1, 2, 3],
              },
            }),
            slashCommand,
          ]}
          editorProps={{
            transformPastedHTML: (html: string) => {
              return cleanWordPastedHTML(html);
            },
            handleDOMEvents: {
              paste: (view: any, event: any) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (const item of items) {
                  if (item.type.indexOf("image") === 0) {
                    const file = item.getAsFile();
                    if (file) {
                      handleImageUpload(file).then((url) => {
                        if (url) {
                          const { $to } = view.state.selection;
                          view.dispatch(
                            view.state.tr.insert(
                              $to.pos,
                              view.state.schema.nodes.image.create({ src: url })
                            )
                          );
                        }
                      });
                      event.preventDefault();
                    }
                  }
                }
                return false;
              },
            },
          }}
          className="prose prose-sm max-w-none w-full p-4 focus:outline-none text-slate-900"
          onUpdate={(editor: any) => {
            const html = editor.getHTML?.() || "";
            onChange(html);
          }}
        />

        {/* Slash Commands */}
        <EditorCommand>
          <EditorCommandEmpty className="px-2 text-slate-600">
            Nenhum comando encontrado
          </EditorCommandEmpty>
          <EditorCommandList>
            <EditorCommandItem
              value="h1"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleHeading?.({ level: 1 })?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Título 1
            </EditorCommandItem>
            <EditorCommandItem
              value="h2"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleHeading?.({ level: 2 })?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Título 2
            </EditorCommandItem>
            <EditorCommandItem
              value="h3"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleHeading?.({ level: 3 })?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Título 3
            </EditorCommandItem>
            <EditorCommandItem
              value="bold"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleBold?.()?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Negrito
            </EditorCommandItem>
            <EditorCommandItem
              value="italic"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleItalic?.()?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Itálico
            </EditorCommandItem>
            <EditorCommandItem
              value="ul"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleBulletList?.()?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Lista
            </EditorCommandItem>
            <EditorCommandItem
              value="ol"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleOrderedList?.()?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Lista Numerada
            </EditorCommandItem>
            <EditorCommandItem
              value="quote"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleBlockquote?.()?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Citação
            </EditorCommandItem>
            <EditorCommandItem
              value="code"
              onCommand={(editor: any) => {
                editor?.chain?.()?.focus?.()?.toggleCodeBlock?.()?.run?.();
              }}
              className="px-2 py-1 text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Código
            </EditorCommandItem>
          </EditorCommandList>
        </EditorCommand>
      </EditorRoot>
    </div>
  );
}
