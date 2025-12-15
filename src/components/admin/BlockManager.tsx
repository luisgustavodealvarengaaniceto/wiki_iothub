"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Trash2, 
  Eye, 
  Edit,
  Plus
} from "lucide-react";

// Imports dos blocos especializados
import TextBlock from "./blocks/TextBlock";
import { EditorHtmlBlock } from "./blocks/EditorHtmlBlock";

// Tipos
export type BlockType = "text" | "raw-html";

export interface Block {
  id: string;
  type: BlockType;
  order: number;
  data: any;
}

interface BlockManagerProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
}

// Componente para um bloco individual (sortable)
function SortableBlock({
  block,
  isEditing,
  onEdit,
  onDelete,
  children,
}: {
  block: Block;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-white border border-slate-200 rounded-lg p-4 mb-4 hover:border-blue-300 transition"
    >
      {/* Controles flutuantes */}
      <div className="absolute -left-12 top-4 opacity-0 group-hover:opacity-100 transition flex flex-col gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-2 bg-slate-200 rounded hover:bg-slate-300 cursor-grab active:cursor-grabbing"
          title="Arrastar"
        >
          <GripVertical size={16} className="text-slate-900" />
        </button>
      </div>

      <div className="absolute -right-12 top-4 opacity-0 group-hover:opacity-100 transition flex flex-col gap-2">
        <button
          type="button"
          onClick={onEdit}
          className={`p-2 rounded hover:bg-blue-100 transition ${
            isEditing ? "bg-blue-100" : "bg-slate-200"
          }`}
          title={isEditing ? "Visualizar" : "Editar"}
        >
          {isEditing ? <Eye size={16} className="text-blue-600" /> : <Edit size={16} className="text-slate-900" />}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-2 bg-slate-200 rounded hover:bg-red-100 transition"
          title="Deletar"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>

      {/* Conteúdo do bloco */}
      <div className="min-h-[80px]">{children}</div>
    </div>
  );
}

// Componente principal
export default function BlockManager({ blocks, onChange }: BlockManagerProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showToolbox, setShowToolbox] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);

      const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, idx) => ({
        ...b,
        order: idx,
      }));

      onChange(reordered);
    }
  };

  const handleAddBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type,
      order: blocks.length,
      data: getDefaultDataForType(type),
    };

    onChange([...blocks, newBlock]);
    setEditingBlockId(newBlock.id);
    setShowToolbox(false);
  };

  const handleDeleteBlock = (id: string) => {
    const filtered = blocks.filter((b) => b.id !== id).map((b, idx) => ({
      ...b,
      order: idx,
    }));
    onChange(filtered);
    if (editingBlockId === id) setEditingBlockId(null);
  };

  const handleUpdateBlock = (id: string, data: any) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, data } : b));
    onChange(updated);
  };

  const toggleEdit = (id: string) => {
    setEditingBlockId(editingBlockId === id ? null : id);
  };

  return (
    <div className="relative max-w-4xl mx-auto pl-16 pr-16">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              isEditing={editingBlockId === block.id}
              onEdit={() => toggleEdit(block.id)}
              onDelete={() => handleDeleteBlock(block.id)}
            >
              {renderBlock(
                block,
                editingBlockId === block.id,
                (data) => handleUpdateBlock(block.id, data)
              )}
            </SortableBlock>
          ))}
        </SortableContext>
      </DndContext>

      {/* Botão Adicionar Seção */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowToolbox(!showToolbox)}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-700 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={20} />
          Adicionar Seção
        </button>

        {/* Toolbox */}
        {showToolbox && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-xl p-4 z-20 grid grid-cols-3 gap-3">
            {BLOCK_TYPES.map((type) => (
              <button
                key={type.type}
                type="button"
                onClick={() => handleAddBlock(type.type)}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition text-center"
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="font-medium text-sm text-slate-900">{type.label}</div>
                <div className="text-xs text-slate-500 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {blocks.length === 0 && (
        <div className="text-center py-12 text-slate-700">
          <p className="text-lg mb-2 font-medium">Nenhum bloco adicionado ainda</p>
          <p className="text-sm text-slate-600">Clique em "Adicionar Seção" para começar</p>
        </div>
      )}
    </div>
  );
}

function renderBlock(block: Block, isEditing: boolean, onChange: (data: any) => void) {
  switch (block.type) {
    case "text":
      return <TextBlock data={block.data} isEditing={isEditing} onChange={onChange} />;
    case "raw-html":
      return <EditorHtmlBlock data={block.data} onChange={onChange} />;
    default:
      return (
        <div className="text-red-500">
          Tipo de bloco desconhecido: {block.type}
        </div>
      );
  }
}

function getDefaultDataForType(type: BlockType): any {
  switch (type) {
    case "text":
      return { content: "<p>Seu texto aqui...</p>" };
    case "raw-html":
      return "";
    default:
      return {};
  }
}

// Tipos de blocos disponíveis
const BLOCK_TYPES = [
  {
    type: "text" as BlockType,
    icon: "📝",
    label: "Texto",
    description: "Parágrafo com formatação rich text",
  },
  {
    type: "raw-html" as BlockType,
    icon: "🔗",
    label: "HTML (PDF)",
    description: "Cole HTML de PDF convertido",
  },
];
