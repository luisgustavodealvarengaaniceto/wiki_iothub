"use client";

import { useState } from "react";
import { EditorHtmlBlock } from "@/components/admin/blocks/EditorHtmlBlock";

interface SimplePageEditorProps {
  pageTitle: string;
  pageSlug: string;
  textContent: string;
  htmlContent: string;
  onSave: (data: { title: string; slug: string; textContent: string; htmlContent: string }) => Promise<void>;
  isSaving?: boolean;
}

/**
 * Editor simplificado com apenas 2 blocos:
 * 1. Texto (usando Novel)
 * 2. Raw HTML (para PDFs)
 */
export function SimplePageEditor({
  pageTitle,
  pageSlug,
  textContent,
  htmlContent,
  onSave,
  isSaving = false,
}: SimplePageEditorProps) {
  const [title, setTitle] = useState(pageTitle);
  const [slug, setSlug] = useState(pageSlug);
  const [text, setText] = useState(textContent);
  const [html, setHtml] = useState(htmlContent);

  const handleSave = async () => {
    await onSave({
      title,
      slug,
      textContent: text,
      htmlContent: html,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Info */}
      <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-3">
          <h3 className="font-semibold text-slate-900">Informações da Página</h3>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-600"
              placeholder="Título da página"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL (slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:ring-2 focus:ring-blue-600"
              placeholder="url-da-pagina"
            />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-3">
          <h3 className="font-semibold text-slate-900">Conteúdo de Texto</h3>
        </div>
        <div className="p-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite o conteúdo da página aqui..."
            className="w-full h-64 px-3 py-2 border border-slate-300 rounded-md font-mono text-sm text-slate-900 focus:ring-2 focus:ring-blue-600"
          />
          <p className="text-xs text-slate-600 mt-2">
            Suporte a Markdown: **negrito**, *itálico*, # Título, - Lista, etc.
          </p>
        </div>
      </div>

      {/* Raw HTML Block */}
      <EditorHtmlBlock
        data={html}
        onChange={setHtml}
      />

      {/* Save Button */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-md font-medium transition"
        >
          {isSaving ? "Salvando..." : "Salvar Página"}
        </button>
      </div>
    </div>
  );
}
