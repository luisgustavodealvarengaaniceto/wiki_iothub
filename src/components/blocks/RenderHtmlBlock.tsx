"use client";

import { HtmlContainer } from "@/components/HtmlContainer";

interface RenderHtmlBlockProps {
  data: string;
}

/**
 * Renderiza bloco HTML isolado na página pública
 */
export function RenderHtmlBlock({ data }: RenderHtmlBlockProps) {
  console.log("🔍 RenderHtmlBlock - Data recebida:", data ? `${data.substring(0, 100)}...` : "VAZIO");
  console.log("🔍 RenderHtmlBlock - Tamanho:", data?.length || 0);
  
  if (!data || data.trim().length === 0) {
    console.warn("⚠️ RenderHtmlBlock - Data vazia, não renderizando");
    return null;
  }

  return (
    <div className="w-full mb-8 text-slate-900">
      <HtmlContainer html={data} cleanPdf={true} />
    </div>
  );
}
