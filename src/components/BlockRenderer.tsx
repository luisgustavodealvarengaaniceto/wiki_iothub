"use client";

import React from "react";
import { RenderHtmlBlock } from "./blocks/RenderHtmlBlock";

interface BlockRendererProps {
  block: any;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  console.log("🔴 [RENDERER] ========== INÍCIO ==========");
  console.log("🔴 [RENDERER] Tipo:", block.type);
  console.log("🔴 [RENDERER] Data type:", typeof block.data);
  console.log("🔴 [RENDERER] Data raw:", block.data);
  
  let parsedData;
  try {
    parsedData = typeof block.data === 'string' ? JSON.parse(block.data) : block.data;
    console.log("🔴 [RENDERER] Data parsed:", parsedData);
  } catch (e) {
    console.error("🔴 [RENDERER] ERRO ao fazer parse:", e);
    parsedData = block.data;
  }
  
  console.log("🔴 [RENDERER] Comparando block.type:", block.type, "===", "code", "?", block.type === "code");
  console.log("🔴 [RENDERER] Comparando block.type:", block.type, "===", "text", "?", block.type === "text");
  console.log("🔴 [RENDERER] Comparando block.type:", block.type, "===", "table", "?", block.type === "table");
  
  switch (block.type) {
    case "text":
      console.log("🔴 [RENDERER] ✅ Renderizando TEXT");
      return <TextComponent block={{ ...block, data: parsedData }} />;
    case "raw-html":
      console.log("🔴 [RENDERER] ✅ Renderizando RAW-HTML");
      const htmlData = typeof block.data === 'string' ? block.data : '';
      console.log("🔍 BlockRenderer - raw-html data:", htmlData ? `${htmlData.substring(0, 100)}...` : "VAZIO");
      return <RenderHtmlBlock data={htmlData} />;
    case "code":
      console.log("🔴 [RENDERER] ✅ Renderizando CODE");
      return <CodeComponent data={parsedData} />;
    case "table":
      console.log("🔴 [RENDERER] ✅ Renderizando TABLE");
      return <TableComponent data={parsedData} />;
    case "image":
      console.log("🔴 [RENDERER] ✅ Renderizando IMAGE");
      return <ImageComponent data={parsedData} />;
    default:
      console.warn("⚠️ Tipo de bloco desconhecido:", block.type);
      console.warn("⚠️ Tipo real (JSON):", JSON.stringify(block.type));
      console.warn("⚠️ Block completo:", JSON.stringify(block, null, 2));
      return (
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-yellow-800">
          ⚠️ Tipo de bloco desconhecido: {block.type}
        </div>
      );
  }
}

// Componente Text
function TextComponent({ block }: { block: any }) {
  const aligns: { [key: string]: string } = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  console.log("\n🔴🔴🔴 [TEXT COMPONENT] Iniciando renderização");
  console.log("🔴 [TEXT COMPONENT] block.data (typeof):", typeof block.data);
  console.log("🔴 [TEXT COMPONENT] block.data.content existe?", !!block.data?.content);
  
  if (block.data?.content) {
    console.log("🔴 [TEXT COMPONENT] Content (primeiros 300 chars):", block.data.content.substring(0, 300));
    console.log("🔴 [TEXT COMPONENT] Tem tags HTML (<)?", block.data.content.includes('<'));
    console.log("🔴 [TEXT COMPONENT] Tem <strong>?", block.data.content.includes('<strong>'));
    console.log("🔴 [TEXT COMPONENT] Tem <h3>?", block.data.content.includes('<h3>'));
    console.log("🔴 [TEXT COMPONENT] Tem <ul>?", block.data.content.includes('<ul>'));
    console.log("🔴 [TEXT COMPONENT] Tem <code>?", block.data.content.includes('<code>'));
  } else {
    console.log("🔴 [TEXT COMPONENT] ⚠️ CONTENT VAZIO OU INDEFINIDO!");
  }
  
  return (
    <div className="mb-8">
      <style jsx>{`
        div :global(h1) { 
          font-size: 2.25em !important; 
          font-weight: 700 !important; 
          margin: 1.5em 0 0.75em 0 !important; 
          color: #0f172a !important; 
          line-height: 1.2 !important;
          letter-spacing: -0.025em !important;
        }
        div :global(h2) { 
          font-size: 1.875em !important; 
          font-weight: 700 !important; 
          margin: 1.25em 0 0.65em 0 !important; 
          color: #1e293b !important; 
          line-height: 1.3 !important;
          letter-spacing: -0.02em !important;
        }
        div :global(h3) { 
          font-size: 1.5em !important; 
          font-weight: 600 !important; 
          margin: 1.15em 0 0.6em 0 !important; 
          color: #334155 !important; 
          line-height: 1.4 !important;
        }
        div :global(h4) { 
          font-size: 1.25em !important; 
          font-weight: 600 !important; 
          margin: 1em 0 0.5em 0 !important; 
          color: #475569 !important; 
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
        div :global(ul ul),
        div :global(ol ol),
        div :global(ul ol),
        div :global(ol ul) {
          margin: 0.5em 0 !important;
        }
        div :global(a) { 
          color: #2563eb !important; 
          text-decoration: underline !important;
          text-underline-offset: 2px !important;
          transition: color 0.2s !important;
        }
        div :global(a:hover) { 
          color: #1d4ed8 !important; 
        }
        div :global(blockquote) { 
          border-left: 4px solid #3b82f6 !important; 
          padding: 1em 1.5em !important; 
          margin: 1.5em 0 !important;
          background: #f8fafc !important;
          font-style: italic !important; 
          color: #475569 !important;
          border-radius: 0 0.375rem 0.375rem 0 !important;
        }
        div :global(table) { 
          border-collapse: collapse !important; 
          width: 100% !important; 
          border: 1px solid #e2e8f0 !important; 
          margin: 2em 0 !important;
          border-radius: 0.5rem !important;
          overflow: hidden !important;
        }
        div :global(thead) {
          background: linear-gradient(to bottom, #f8fafc, #f1f5f9) !important;
        }
        div :global(th) { 
          border: 1px solid #e2e8f0 !important; 
          background: transparent !important;
          padding: 0.75em 1em !important; 
          text-align: left !important; 
          font-weight: 600 !important; 
          color: #0f172a !important;
          font-size: 0.9375rem !important;
        }
        div :global(td) { 
          border: 1px solid #e2e8f0 !important; 
          padding: 0.75em 1em !important; 
          color: #475569 !important;
          line-height: 1.6 !important;
        }
        div :global(tbody tr:nth-child(even)) {
          background: #f8fafc !important;
        }
        div :global(tbody tr:hover) {
          background: #f1f5f9 !important;
        }
        div :global(hr) {
          border: none !important;
          border-top: 2px solid #e2e8f0 !important;
          margin: 2em 0 !important;
        }
      `}</style>
      <div dangerouslySetInnerHTML={{ __html: block.data?.content || '' }} />
    </div>
  );
}

// Componente Code
function CodeComponent({ data }: { data: any }) {
  return (
    <div className="my-6">
      <pre className="bg-slate-900 text-white rounded-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono">{data?.code || ''}</code>
      </pre>
    </div>
  );
}

// Componente Table
function TableComponent({ data }: { data: any }) {
  if (!data?.rows || data.rows.length === 0) return null;
  
  return (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full border-collapse border border-slate-300">
        <thead>
          <tr className="bg-slate-100">
            {data.columns?.map((col: string, idx: number) => (
              <th key={idx} className="border border-slate-300 px-4 py-2 text-left text-slate-900 font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row: string[], rowIdx: number) => (
            <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
              {row.map((cell: string, cellIdx: number) => (
                <td key={cellIdx} className="border border-slate-300 px-4 py-2 text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Componente Image
function ImageComponent({ data }: { data: any }) {
  if (!data?.url) return null;
  
  return (
    <div className="my-6">
      <img
        src={data.url}
        alt={data.alt || "Imagem"}
        className="max-w-full h-auto rounded-lg shadow-sm"
      />
      {data.alt && (
        <p className="text-sm text-slate-500 text-center mt-2">{data.alt}</p>
      )}
    </div>
  );
}
