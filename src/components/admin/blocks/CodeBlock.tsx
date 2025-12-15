"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockData {
  language: string;
  code: string;
}

interface CodeBlockProps {
  data: CodeBlockData;
  isEditing: boolean;
  onChange: (data: CodeBlockData) => void;
}

const LANGUAGES = [
  { value: "json", label: "JSON" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "bash", label: "Bash/Shell" },
  { value: "python", label: "Python" },
  { value: "sql", label: "SQL" },
  { value: "yaml", label: "YAML" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

export default function CodeBlock({ data, isEditing, onChange }: CodeBlockProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="text-xs text-slate-500 uppercase font-medium mb-3">
          💻 Editando Código
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Linguagem
          </label>
          <select
            value={data.language}
            onChange={(e) => onChange({ ...data, language: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Código
          </label>
          <textarea
            value={data.code}
            onChange={(e) => onChange({ ...data, code: e.target.value })}
            rows={12}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Cole seu código aqui..."
            spellCheck={false}
          />
        </div>
      </div>
    );
  }

  // Preview Mode - WYSIWYG com syntax highlighting
  return (
    <div className="rounded-lg overflow-hidden shadow-lg border border-slate-200">
      {/* Header do bloco de código */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
        <span className="text-slate-300 text-xs font-medium uppercase">
          {LANGUAGES.find((l) => l.value === data.language)?.label || data.language}
        </span>
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(data.code)}
          className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded transition"
        >
          Copiar
        </button>
      </div>

      {/* Código com syntax highlighting */}
      <SyntaxHighlighter
        language={data.language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.875rem",
          padding: "1.25rem",
        }}
        showLineNumbers
      >
        {data.code}
      </SyntaxHighlighter>
    </div>
  );
}
