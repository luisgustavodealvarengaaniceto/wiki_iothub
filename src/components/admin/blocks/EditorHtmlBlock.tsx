"use client";

import { useState } from "react";
import { Eye, Code, Copy, Trash2 } from "lucide-react";
import { HtmlContainer } from "@/components/HtmlContainer";

interface EditorHtmlBlockProps {
  data?: string;
  onChange: (html: string) => void;
  onDelete?: () => void;
}

/**
 * Editor de bloco HTML para PDFs convertidos
 * Permite colar HTML complexo com preview isolado
 */
export function EditorHtmlBlock({
  data = "",
  onChange,
  onDelete,
}: EditorHtmlBlockProps) {
  const [html, setHtml] = useState(data);
  const [showPreview, setShowPreview] = useState(false);
  const [charCount, setCharCount] = useState(data.length);
  const [copied, setCopied] = useState(false);
  const [cleanPdf, setCleanPdf] = useState(true);

  const handleChange = (newHtml: string) => {
    setHtml(newHtml);
    setCharCount(newHtml.length);
    onChange(newHtml);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      handleChange(clipboardText);
    } catch (err) {
      alert("Erro ao ler clipboard. Tente colar manualmente (Ctrl+V).");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm("Limpar todo o conteúdo HTML?")) {
      handleChange("");
    }
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-slate-100 border-b border-slate-300 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-slate-700" />
          <h3 className="font-semibold text-slate-900">Bloco HTML (PDF Convertido)</h3>
        </div>
        <div className="text-xs text-slate-600">
          {charCount.toLocaleString()} caracteres
        </div>
      </div>

      {/* Instruções */}
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <p className="text-sm text-blue-900">
          💡 Cole aqui o HTML gerado pela conversão do PDF. O conteúdo será renderizado de forma isolada para não quebrar o layout da página.
        </p>
      </div>

      {/* Editor */}
      <div className="p-4 space-y-3">
        {/* Toolbar */}
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={handlePaste}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition"
            title="Colar do clipboard"
          >
            📋 Colar HTML
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-2 rounded text-sm font-medium transition flex items-center gap-1 ${
              showPreview
                ? "bg-slate-200 text-slate-900"
                : "bg-slate-100 hover:bg-slate-200 text-slate-900"
            }`}
            title="Visualizar preview"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? "Esconder" : "Preview"}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded text-sm font-medium transition flex items-center gap-1"
            title="Copiar HTML"
          >
            <Copy className="w-4 h-4" />
            {copied ? "Copiado!" : "Copiar"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition flex items-center gap-1"
            title="Limpar conteúdo"
          >
            <Trash2 className="w-4 h-4" />
            Limpar
          </button>
        </div>

        {/* Editor de Texto */}
        <div className="relative">
          <textarea
            value={html}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Cole o HTML do PDF aqui ou clique em 'Colar HTML'..."
            className="w-full h-64 p-3 font-mono text-sm border border-slate-300 rounded bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 resize-vertical"
            spellCheck="false"
          />
          <div className="absolute bottom-2 right-2 text-xs text-slate-400">
            Ctrl+V para colar
          </div>
        </div>

        {/* Info */}
        {html && (
          <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            ✓ HTML armazenado ({(html.length / 1024).toFixed(1)} KB)
          </div>
        )}

        {/* Toggle PDF Cleaner */}
        <div className="flex items-center gap-3 bg-amber-50 p-3 rounded border border-amber-200">
          <input
            type="checkbox"
            id="cleanPdf"
            checked={cleanPdf}
            onChange={(e) => setCleanPdf(e.target.checked)}
            className="w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
          />
          <label htmlFor="cleanPdf" className="text-sm text-amber-900 cursor-pointer flex-1">
            <span className="font-medium">🧹 Modo PDF Limpo</span>
            <p className="text-xs text-amber-700 mt-0.5">
              Remove fundo cinza, sombras e navegação lateral do PDF. Mantém apenas o conteúdo.
            </p>
          </label>
        </div>
      </div>

      {/* Preview */}
      {showPreview && html && (
        <div className="border-t border-slate-300 p-4">
          <h4 className="font-semibold text-slate-900 mb-3 text-sm">Preview:</h4>
          <div className="max-h-96">
            <HtmlContainer html={html} maxHeight="400px" cleanPdf={cleanPdf} />
          </div>
        </div>
      )}

      {/* Delete Button */}
      {onDelete && (
        <div className="border-t border-slate-300 px-4 py-3 bg-slate-50">
          <button
            type="button"
            onClick={onDelete}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Deletar este bloco
          </button>
        </div>
      )}
    </div>
  );
}
