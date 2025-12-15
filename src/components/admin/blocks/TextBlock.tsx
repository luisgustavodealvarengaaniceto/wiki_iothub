"use client";

import { RichTextEditor } from "../RichTextEditor";

interface TextBlockData {
  content: string;
}

interface TextBlockProps {
  data: TextBlockData;
  isEditing: boolean;
  onChange: (data: TextBlockData) => void;
}

export default function TextBlock({ data, isEditing, onChange }: TextBlockProps) {
  console.log("🟡 [TEXT BLOCK] Data recebido:", data);
  console.log("🟡 [TEXT BLOCK] Content:", data.content);
  
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="text-xs text-slate-500 uppercase font-medium mb-3">
          📝 Editor de Texto
        </div>

        <RichTextEditor
          content={data.content}
          onChange={(html) => {
            console.log("🟡 [TEXT BLOCK] onChange chamado, HTML:", html);
            onChange({ content: html });
          }}
          placeholder="Cole ou digite seu texto aqui... (de PDF, Word, ChatGPT, etc)"
        />
      </div>
    );
  }

  // Preview Mode - WYSIWYG
  return (
    <div className="bg-gradient-to-br from-white to-slate-50 p-6 rounded-lg border-2 border-slate-200 shadow-sm">
      <div className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        Preview - Como ficará para o usuário
      </div>
      <style jsx>{`
        div :global(h1) { 
          font-size: 2.25em !important; 
          font-weight: 700 !important; 
          margin: 1.5em 0 0.75em 0 !important; 
          color: #0f172a !important; 
          line-height: 1.2 !important;
        }
        div :global(h2) { 
          font-size: 1.875em !important; 
          font-weight: 700 !important; 
          margin: 1.25em 0 0.65em 0 !important; 
          color: #1e293b !important; 
          line-height: 1.3 !important;
        }
        div :global(h3) { 
          font-size: 1.5em !important; 
          font-weight: 600 !important; 
          margin: 1.15em 0 0.6em 0 !important; 
          color: #334155 !important; 
          line-height: 1.4 !important;
        }
        div :global(p) { 
          margin: 1.25em 0 !important; 
          line-height: 1.75 !important; 
          color: #475569 !important; 
          font-size: 1rem !important;
        }
        div :global(strong) { 
          font-weight: 600 !important; 
          color: #0f172a !important; 
        }
        div :global(em) { 
          font-style: italic !important; 
          color: #64748b !important;
        }
        div :global(code) { 
          background: #f1f5f9 !important; 
          padding: 0.25em 0.5em !important; 
          border-radius: 0.25rem !important; 
          font-family: 'Courier New', monospace !important; 
          font-size: 0.875em !important; 
          color: #e11d48 !important;
          border: 1px solid #e2e8f0 !important;
          font-weight: 500 !important;
        }
        div :global(ul) { 
          list-style-type: disc !important; 
          padding-left: 2em !important; 
          margin: 1.5em 0 !important; 
        }
        div :global(ol) { 
          list-style-type: decimal !important; 
          padding-left: 2em !important; 
          margin: 1.5em 0 !important; 
        }
        div :global(li) { 
          margin: 0.75em 0 !important; 
          color: #475569 !important; 
          line-height: 1.6 !important;
          padding-left: 0.5em !important;
        }
        div :global(li > p) {
          margin: 0.5em 0 !important;
        }
        div :global(a) { 
          color: #2563eb !important; 
          text-decoration: underline !important;
          text-underline-offset: 2px !important;
        }
        div :global(a:hover) { 
          color: #1d4ed8 !important; 
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: data.content }} />
    </div>
  );
}
