"use client";

import { useState, useCallback } from "react";
import TextBlock from "./blocks/TextBlock";
import CodeBlock from "./blocks/CodeBlock";
import { ManualTableBlock } from "./blocks/ManualTableBlock";
import { ImageBlock } from "./blocks/ImageBlock";

export interface PageBlock {
  id: string;
  type: "text" | "code" | "table" | "image";
  order: number;
  data: any;
}

interface PageBuilderProps {
  initialBlocks?: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
}

/**
 * PageBuilder - Gerenciador de Blocos Manual
 * Admin adiciona, remove e reordena blocos de conteúdo
 */
export function PageBuilder({ initialBlocks = [], onChange }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const handleAddBlock = useCallback(
    (type: PageBlock["type"]) => {
      const newBlock: PageBlock = {
        id: `block-${Date.now()}`,
        type,
        order: blocks.length,
        data:
          type === "text"
            ? { content: "" }
            : type === "code"
            ? { language: "json", code: "" }
            : type === "table"
            ? { columns: [], rows: [] }
            : { url: "", alt: "" },
      };

      const updatedBlocks = [...blocks, newBlock];
      setBlocks(updatedBlocks);
      onChange(updatedBlocks);
      setEditingBlockId(newBlock.id);
    },
    [blocks, onChange]
  );

  const handleUpdateBlock = useCallback(
    (id: string, newData: any) => {
      const updatedBlocks = blocks.map((block) =>
        block.id === id ? { ...block, data: newData } : block
      );
      setBlocks(updatedBlocks);
      onChange(updatedBlocks);
    },
    [blocks, onChange]
  );

  const handleRemoveBlock = useCallback(
    (id: string) => {
      const updatedBlocks = blocks.filter((block) => block.id !== id);
      setBlocks(updatedBlocks);
      onChange(updatedBlocks);
    },
    [blocks, onChange]
  );

  const handleMoveBlock = useCallback(
    (id: string, direction: "up" | "down") => {
      const index = blocks.findIndex((b) => b.id === id);
      if (index === -1) return;

      if (direction === "up" && index > 0) {
        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
        setBlocks(newBlocks);
        onChange(newBlocks);
      }

      if (direction === "down" && index < blocks.length - 1) {
        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
        setBlocks(newBlocks);
        onChange(newBlocks);
      }
    },
    [blocks, onChange]
  );

  const getBlockLabel = (type: PageBlock["type"]): string => {
    const labels = {
      text: "📝 Texto",
      code: "💻 Código",
      table: "📊 Tabela",
      image: "🖼️ Imagem",
    };
    return labels[type];
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border border-slate-300 rounded-lg p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleAddBlock("text")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition"
          >
            + Texto
          </button>
          <button
            onClick={() => handleAddBlock("code")}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 font-medium text-sm transition"
          >
            + Código
          </button>
          <button
            onClick={() => handleAddBlock("table")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition"
          >
            + Tabela
          </button>
          <button
            onClick={() => handleAddBlock("image")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium text-sm transition"
          >
            + Imagem
          </button>
        </div>

        {blocks.length > 0 && (
          <div className="mt-3 text-xs text-slate-600">
            📌 {blocks.length} {blocks.length === 1 ? "bloco" : "blocos"} adicionado(s)
          </div>
        )}
      </div>

      {/* Blocos */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center text-slate-500">
            <p className="text-lg font-medium mb-2">Nenhum bloco adicionado</p>
            <p className="text-sm">Clique nos botões acima para começar a criar seu conteúdo</p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={block.id}
              className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
            >
              {/* Header do bloco */}
              <div className="bg-slate-50 border-b border-slate-300 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {getBlockLabel(block.type)}
                  </span>
                  <span className="text-xs text-slate-500">#{index + 1}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Botões de reordenação */}
                  {index > 0 && (
                    <button
                      onClick={() => handleMoveBlock(block.id, "up")}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded text-sm"
                      title="Mover para cima"
                    >
                      ↑
                    </button>
                  )}
                  {index < blocks.length - 1 && (
                    <button
                      onClick={() => handleMoveBlock(block.id, "down")}
                      className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded text-sm"
                      title="Mover para baixo"
                    >
                      ↓
                    </button>
                  )}

                  {/* Botão de remover */}
                  <button
                    onClick={() => handleRemoveBlock(block.id)}
                    className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                    title="Remover bloco"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Conteúdo do bloco */}
              <div className="p-4">
                {block.type === "text" && (
                  <TextBlock
                    data={block.data}
                    isEditing={editingBlockId === block.id}
                    onChange={(newData) => handleUpdateBlock(block.id, newData)}
                  />
                )}

                {block.type === "code" && (
                  <CodeBlock
                    data={block.data}
                    isEditing={editingBlockId === block.id}
                    onChange={(newData) => handleUpdateBlock(block.id, newData)}
                  />
                )}

                {block.type === "table" && (
                  <ManualTableBlock
                    data={block.data}
                    onChange={(newData) => handleUpdateBlock(block.id, newData)}
                    onRemove={() => handleRemoveBlock(block.id)}
                  />
                )}

                {block.type === "image" && (
                  <ImageBlock
                    data={block.data}
                    isEditing={editingBlockId === block.id}
                    onChange={(newData) => handleUpdateBlock(block.id, newData)}
                  />
                )}

                {/* Botão para alternar edição */}
                {block.type === "text" || block.type === "code" || block.type === "image" ? (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() =>
                        setEditingBlockId(
                          editingBlockId === block.id ? null : block.id
                        )
                      }
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {editingBlockId === block.id ? "✅ Pronto" : "✏️ Editar"}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
