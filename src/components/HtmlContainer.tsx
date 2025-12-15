"use client";

import { useEffect, useRef } from "react";
import { PDF_CLEANER_CSS } from "@/constants/pdfCleaner";

interface HtmlContainerProps {
  html: string;
  maxHeight?: string;
  cleanPdf?: boolean;
}

/**
 * Renderiza HTML diretamente no DOM
 * Remove scripts por segurança e opcionalmente limpa estilos de PDF
 */
export function HtmlContainer({ html, maxHeight = "auto", cleanPdf = true }: HtmlContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!html || !containerRef.current) {
      return;
    }

    try {
      // Remove scripts por segurança
      const parser = new DOMParser();
      const domDoc = parser.parseFromString(html, "text/html");
      domDoc.querySelectorAll("script").forEach((script) => script.remove());

      // Se cleanPdf está ativo, injeta CSS de limpeza
      let cleanHtml = domDoc.documentElement.innerHTML;
      if (cleanPdf) {
        // Insere o CSS de limpeza antes do conteúdo
        cleanHtml = `<style>${PDF_CLEANER_CSS}</style>${cleanHtml}`;
      }

      // Insere diretamente no DOM
      containerRef.current.innerHTML = cleanHtml;
      
      console.log("✅ HTML renderizado" + (cleanPdf ? " com limpeza de PDF" : ""));
    } catch (err) {
      console.error("❌ Erro ao renderizar HTML:", err);
    }
  }, [html, cleanPdf]);

  return (
    <div 
      ref={containerRef}
      className="w-full text-slate-900"
      style={{
        maxHeight: maxHeight === "auto" ? undefined : maxHeight,
        overflow: maxHeight === "auto" ? "visible" : "auto",
      }}
    />
  );
}
