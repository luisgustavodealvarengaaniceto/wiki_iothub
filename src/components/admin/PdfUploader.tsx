"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";

interface PdfUploaderProps {
  onPdfUploaded: (pdfUrl: string, fileName: string) => void;
  currentPdf?: string;
  currentFileName?: string;
}

export function PdfUploader({ onPdfUploaded, currentPdf, currentFileName }: PdfUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar se é PDF
    if (file.type !== "application/pdf") {
      setError("Por favor, selecione um arquivo PDF válido");
      return;
    }

    // Validar tamanho (máximo 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError("O arquivo é muito grande. Máximo 50MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload do PDF");
      }

      const data = await response.json();
      onPdfUploaded(data.url, file.name);
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer upload");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onPdfUploaded("", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-slate-900">
        Upload do PDF (Opcional)
      </label>

      {currentPdf ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-slate-900">{currentFileName}</p>
              <a
                href={currentPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Visualizar PDF
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 hover:bg-red-100 rounded transition"
            title="Remover PDF"
          >
            <X className="w-5 h-5 text-red-600" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-900">
            Clique para adicionar um PDF
          </p>
          <p className="text-xs text-slate-500 mt-1">
            ou arraste um arquivo PDF aqui
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Máximo 50MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
          Carregando PDF...
        </div>
      )}
    </div>
  );
}
