"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { processPdfPaste, detectTablePattern, textTableToHtml } from "@/utils/paste-helpers";
import { 
  Bold, 
  Italic, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  Link as LinkIcon,
  Unlink,
  Heading2,
  Table as TableIcon,
  Plus,
  Minus,
  Trash2,
  CheckSquare
} from "lucide-react";
import { useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Desabilita code block padrão (usaremos versão customizada depois)
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "text-blue-600 underline hover:text-blue-700 cursor-pointer",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full border border-slate-300 my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-slate-300",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-slate-300 bg-slate-100 font-bold text-left px-4 py-2 text-slate-900",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-slate-300 px-4 py-2 text-slate-700",
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "not-prose pl-2 space-y-2",
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start gap-2",
        },
        nested: true,
      }),
      Placeholder.configure({
        placeholder: placeholder || "Cole seu texto, tabelas ou código aqui (Ctrl+V)... A formatação será preservada.",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-slate max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
      handlePaste: (view, event) => {
        // Tenta obter HTML primeiro (de PDFs, Word, etc)
        let html = event.clipboardData?.getData("text/html");
        
        // Se não houver HTML, tenta processar texto plano
        if (!html) {
          const plainText = event.clipboardData?.getData("text/plain");
          
          if (plainText && editor) {
            // Usa sistema inteligente de detecção de padrões
            const processedHtml = processPdfPaste(plainText);
            editor.commands.insertContent(processedHtml);
            event.preventDefault();
            return true;
          }
          return false;
        }
        
        // Processa HTML rico
        if (html && editor) {
          console.log("Processando HTML rico...");
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          
          // Função recursiva para processar nós e preservar formatação
          const processNode = (node: Node, depth = 0): string => {
            if (node.nodeType === 3) { // Text node
              const text = node.textContent || "";
              return text.trim() ? text : "";
            }
            if (node.nodeType !== 1) return ""; // Ignora outros tipos
            
            const el = node as Element;
            const tag = el.tagName.toLowerCase();
            const children = Array.from(el.childNodes)
              .map(child => processNode(child, depth + 1))
              .filter(text => text || tag !== "span") // Evita spans vazios
              .join("");
            
            // Skip se for vazio
            if (!children && !["br", "hr", "img"].includes(tag)) return "";
            
            // Processa cada tipo de tag
            switch (tag) {
              case "table":
              case "tbody":
                return `<table>${children}</table>`;
              case "thead":
                return children; // tbody já envolve
              case "tr":
                return `<tr>${children}</tr>`;
              case "td":
              case "th":
                // Preserva th como td (Tiptap renderiza automaticamente)
                return `<td>${children}</td>`;
              
              // Formatação inline
              case "strong":
              case "b":
                return `<strong>${children}</strong>`;
              case "em":
              case "i":
                return `<em>${children}</em>`;
              case "u":
                return `<u>${children}</u>`;
              case "code":
                return `<code>${children}</code>`;
              case "a":
                const href = el.getAttribute("href");
                return href ? `<a href="${href}">${children}</a>` : children;
              
              // Blocos
              case "p":
              case "div":
              case "section":
              case "article":
                return children ? `<p>${children}</p>` : "";
              case "blockquote":
                return `<blockquote>${children}</blockquote>`;
              case "pre":
                return `<pre>${children}</pre>`;
              case "h1":
                return `<h1>${children}</h1>`;
              case "h2":
                return `<h2>${children}</h2>`;
              case "h3":
                return `<h3>${children}</h3>`;
              case "h4":
                return `<h4>${children}</h4>`;
              case "h5":
                return `<h5>${children}</h5>`;
              case "h6":
                return `<h6>${children}</h6>`;
              
              // Listas
              case "ul":
              case "ol":
                return `<${tag}>${children}</${tag}>`;
              case "li":
                return `<li>${children}</li>`;
              
              // Quebra de linha
              case "br":
              case "hr":
                return `<${tag}>`;
              
              // Containers que apenas passam conteúdo
              case "span":
              case "font":
                return children;
              
              // Ignora estilos, scripts e outros
              case "style":
              case "script":
              case "meta":
              case "link":
                return "";
              
              // Default: extrai conteúdo
              default:
                return children;
            }
          };
          
          let cleanHtml = processNode(doc.body);
          console.log("HTML processado (antes da limpeza):", cleanHtml.substring(0, 300));
          
          // Se o processado é apenas texto (sem tags HTML), converte quebras de linha
          if (cleanHtml && !cleanHtml.includes("<")) {
            console.log("Detectado como texto puro, convertendo quebras de linha...");
            
            const lines = cleanHtml.split("\n");
            const processedLines: string[] = [];
            let codeBlock: string[] = [];
            let inCodeBlock = false;
            
            for (const line of lines) {
              const trimmed = line.trim();
              
              // Detecta início de bloco de código (apenas { ou [ no início)
              const isJsonStart = /^[\s]*{$|^[\s*]\{$|^JSON\s*$|^```/.test(trimmed);
              const isArrayStart = /^[\s]*\[$|^[\s]*\[$/.test(trimmed);
              const isJsonOrCode = isJsonStart || isArrayStart;
              const isEndBracket = /^[\s]*}[\s]*$|^[\s]*][\s]*$/.test(trimmed);
              
              // Se começa bloco de código
              if (isJsonOrCode && !inCodeBlock) {
                inCodeBlock = true;
                codeBlock = [trimmed];
              } 
              // Se está dentro de bloco de código
              else if (inCodeBlock) {
                codeBlock.push(trimmed);
                // Se termina bloco de código
                if (isEndBracket) {
                  // Adiciona bloco de código formatado
                  const codeContent = codeBlock.join("\n").trim();
                  if (codeContent) {
                    processedLines.push(`<pre><code>${codeContent}</code></pre>`);
                  }
                  codeBlock = [];
                  inCodeBlock = false;
                }
              }
              // Linhas normais
              else {
                if (!trimmed) {
                  // Mantém espaçamento entre parágrafos
                  if (processedLines.length > 0 && !processedLines[processedLines.length - 1].includes("</pre>")) {
                    processedLines.push(""); // Marca separação
                  }
                } else if (trimmed.length > 0) {
                  // Detecta listas com bullet points
                  if (/^[•\-\*]\s/.test(trimmed)) {
                    processedLines.push(`<li>${trimmed.substring(2).trim()}</li>`);
                  }
                  // Detecta títulos (linhas curtas em maiúscula ou com números e ponto)
                  else if (/^\d+\.\s/.test(trimmed) && trimmed.length < 80) {
                    processedLines.push(`<h3>${trimmed}</h3>`);
                  }
                  // Padrão comum de seções: "Algo:" 
                  else if (/^[A-Z].*:$/.test(trimmed) && trimmed.length < 100) {
                    processedLines.push(`<h3>${trimmed}</h3>`);
                  }
                  // Texto normal (incluindo URLs)
                  else {
                    processedLines.push(`<p>${trimmed}</p>`);
                  }
                }
              }
            }

            
            // Se ficou um bloco de código inacabado, adiciona mesmo assim
            if (codeBlock.length > 0) {
              const codeContent = codeBlock.join("\n").trim();
              if (codeContent) {
                processedLines.push(`<pre><code>${codeContent}</code></pre>`);
              }
            }
            
            // Processa o array para criar parágrafos contínuos e listas
            let htmlOutput = "";
            let liOpen = false;
            
            for (const item of processedLines) {
              if (item === "") {
                // Quebra entre parágrafos - fecha lista se aberta
                if (liOpen) {
                  htmlOutput += "</ul>";
                  liOpen = false;
                }
              } else if (item.includes("<li>")) {
                if (!liOpen) {
                  htmlOutput += "<ul>";
                  liOpen = true;
                }
                htmlOutput += item;
              } else {
                if (liOpen) {
                  htmlOutput += "</ul>";
                  liOpen = false;
                }
                htmlOutput += item;
              }
            }
            
            if (liOpen) {
              htmlOutput += "</ul>";
            }
            
            cleanHtml = htmlOutput;
          }
          
          // Limpa HTML vazio ou com apenas tags vazias
          cleanHtml = cleanHtml
            .replace(/<p><\/p>/g, "") // Remove parágrafos vazios
            .replace(/<p>\s*<\/p>/g, "") // Remove parágrafos com só espaço
            .trim();
          
          if (cleanHtml) {
            // Insere o HTML processado
            editor.commands.insertContent(cleanHtml);
            event.preventDefault();
            return true;
          }
        }
        
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar Expandida */}
      <div className="border-b border-slate-200 p-2 flex items-center gap-1 flex-wrap bg-slate-50">
        {/* Formatação de Texto */}
        <div className="flex items-center gap-1 pr-2 border-r border-slate-300">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-slate-200 transition ${
            editor.isActive("bold") ? "bg-slate-300" : ""
          }`}
          title="Negrito"
        >
          <Bold className="w-4 h-4 text-slate-700" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-slate-200 transition ${
            editor.isActive("italic") ? "bg-slate-300" : ""
          }`}
          title="Itálico"
        >
          <Italic className="w-4 h-4 text-slate-700" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-slate-200 transition ${
            editor.isActive("code") ? "bg-slate-300" : ""
          }`}
          title="Código"
        >
          <Code className="w-4 h-4 text-slate-700" />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition ${
            editor.isActive("bulletList") ? "bg-slate-300" : ""
          }`}
          title="Lista"
        >
          <List className="w-4 h-4 text-slate-700" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-slate-200 transition ${
            editor.isActive("orderedList") ? "bg-slate-300" : ""
          }`}
          title="Lista Numerada"
        >
          <ListOrdered className="w-4 h-4 text-slate-700" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-slate-200 transition ${
            editor.isActive("blockquote") ? "bg-slate-300" : ""
          }`}
          title="Citação"
        >
          <Quote className="w-4 h-4 text-slate-700" />
        </button>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded hover:bg-slate-200 transition ${
            editor.isActive("link") ? "bg-slate-300" : ""
          }`}
          title="Link"
        >
          <LinkIcon className="w-4 h-4 text-slate-700" />
        </button>
        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-2 rounded hover:bg-slate-200 transition"
            title="Remover Link"
          >
            <Unlink className="w-4 h-4 text-slate-700" />
          </button>
        )}
        </div>

        {/* Controles de Tabela */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-300">
          <button
            type="button"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="p-2 rounded hover:bg-slate-200 transition"
            title="Inserir Tabela 3x3"
          >
            <TableIcon className="w-4 h-4 text-slate-700" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.can().addColumnAfter()}
            className="p-2 rounded hover:bg-slate-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Adicionar Coluna"
          >
            <Plus className="w-4 h-4 text-slate-700" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}
            className="p-2 rounded hover:bg-slate-200 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Adicionar Linha"
          >
            <Plus className="w-4 h-4 text-slate-700 rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.can().deleteColumn()}
            className="p-2 rounded hover:bg-red-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Deletar Coluna"
          >
            <Minus className="w-4 h-4 text-red-600" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.can().deleteRow()}
            className="p-2 rounded hover:bg-red-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Deletar Linha"
          >
            <Minus className="w-4 h-4 text-red-600 rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}
            className="p-2 rounded hover:bg-red-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
            title="Deletar Tabela"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>

        {/* Task List */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-300">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-2 rounded hover:bg-slate-200 transition ${
              editor.isActive("taskList") ? "bg-slate-300" : ""
            }`}
            title="Lista de Tarefas"
          >
            <CheckSquare className="w-4 h-4 text-slate-700" />
          </button>
        </div>

        {/* Converter Seleção em Tabela */}
        <div className="flex items-center gap-1 px-2">
          <button
            type="button"
            onClick={() => {
              const { selection } = editor.state;
              const text = editor.state.doc.textBetween(selection.from, selection.to);
              
              if (text.trim().length === 0) {
                alert("Selecione o texto que deseja converter em tabela");
                return;
              }
              
              const tableDetection = detectTablePattern(text);
              if (tableDetection.isTable) {
                const tableHtml = textTableToHtml(tableDetection.rows);
                editor.chain().focus().insertContent(tableHtml).run();
              } else {
                alert("Não foi detectado um padrão de tabela. Certifique-se de que o texto tem linhas com colunas separadas por tabs ou múltiplos espaços.");
              }
            }}
            className="p-2 rounded hover:bg-slate-200 transition text-xs font-medium"
            title="Converter seleção em tabela (detecta padrões de PDF)"
          >
            <span className="text-slate-700">📋 Converter</span>
          </button>
        </div>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="border-b border-slate-200 p-3 bg-blue-50">
          <div className="flex gap-2">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setLink();
                }
              }}
              placeholder="https://exemplo.com"
              className="flex-1 px-3 py-2 border border-slate-300 rounded text-sm"
            />
            <button
              type="button"
              onClick={setLink}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl("");
              }}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Editor Content com Typography */}
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
}
