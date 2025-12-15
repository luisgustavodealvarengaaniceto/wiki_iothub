"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageBlockData {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ImageBlockProps {
  data: ImageBlockData;
  isEditing: boolean;
  onChange: (data: ImageBlockData) => void;
}

export function ImageBlock({ data, isEditing, onChange }: ImageBlockProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      setUploadError("Por favor, selecione uma imagem válida");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer upload");
      }

      const { url } = await response.json();
      onChange({
        ...data,
        url,
        alt: data.alt || file.name,
      });
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="text-xs text-slate-500 uppercase font-medium">
          🖼️ Editor de Imagem
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload de Imagem
          </label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="flex-1"
            />
            {isUploading && <span className="text-sm text-slate-500">Enviando...</span>}
          </div>
          {uploadError && <p className="text-sm text-red-600 mt-1">{uploadError}</p>}
          {data.url && (
            <p className="text-sm text-green-600 mt-1">✓ Imagem selecionada: {data.url}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Texto Alternativo (Alt)
          </label>
          <input
            type="text"
            value={data.alt}
            onChange={(e) => onChange({ ...data, alt: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição da imagem para acessibilidade"
          />
        </div>

        {data.url && (
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50">
            <p className="text-xs text-slate-500 mb-2">Preview:</p>
            <div className="relative w-full h-40 bg-slate-200 rounded">
              <Image
                src={data.url}
                alt={data.alt}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Preview Mode
  if (!data.url) {
    return (
      <div className="text-center py-8 text-slate-500 text-sm">
        <p>Nenhuma imagem selecionada</p>
      </div>
    );
  }

  return (
    <div className="my-6">
      <div className="relative w-full h-auto bg-slate-100 rounded-lg overflow-hidden">
        <Image
          src={data.url}
          alt={data.alt}
          width={800}
          height={600}
          className="w-full h-auto"
        />
      </div>
      {data.alt && <p className="text-sm text-slate-600 mt-2 text-center italic">{data.alt}</p>}
    </div>
  );
}
