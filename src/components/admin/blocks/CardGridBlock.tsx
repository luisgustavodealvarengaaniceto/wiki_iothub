"use client";

import { Plus, Trash2, ExternalLink } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface Card {
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface CardGridBlockData {
  cards: Card[];
}

interface CardGridBlockProps {
  data: CardGridBlockData;
  isEditing: boolean;
  onChange: (data: CardGridBlockData) => void;
}

// Lista de ícones disponíveis
const ICON_OPTIONS = [
  "box",
  "settings",
  "zap",
  "shield",
  "code",
  "database",
  "terminal",
  "server",
  "cloud",
  "wifi",
  "radio",
  "activity",
  "alert-circle",
  "book",
  "file-text",
];

export default function CardGridBlock({ data, isEditing, onChange }: CardGridBlockProps) {
  const addCard = () => {
    onChange({
      cards: [
        ...data.cards,
        {
          icon: "box",
          title: "Novo Card",
          description: "Descrição do card",
          link: "#",
        },
      ],
    });
  };

  const removeCard = (index: number) => {
    onChange({
      cards: data.cards.filter((_, i) => i !== index),
    });
  };

  const updateCard = (index: number, field: keyof Card, value: string) => {
    const newCards = data.cards.map((card, i) =>
      i === index ? { ...card, [field]: value } : card
    );
    onChange({ cards: newCards });
  };

  // Renderiza ícone dinamicamente
  const renderIcon = (iconName: string, className?: string) => {
    const IconComponent = (LucideIcons as any)[
      iconName
        .split("-")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
    ];

    return IconComponent ? <IconComponent className={className} /> : <LucideIcons.Box className={className} />;
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-slate-500 uppercase font-medium">🃏 Editando Cards</div>
          <button
            type="button"
            onClick={addCard}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition flex items-center gap-1"
          >
            <Plus size={14} /> Card
          </button>
        </div>

        {/* Lista de cards editáveis */}
        <div className="space-y-4">
          {data.cards.map((card, idx) => (
            <div
              key={idx}
              className="p-4 border border-slate-300 rounded-lg bg-slate-50 relative"
            >
              <button
                type="button"
                onClick={() => removeCard(idx)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Ícone
                  </label>
                  <select
                    value={card.icon}
                    onChange={(e) => updateCard(idx, "icon", e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    {ICON_OPTIONS.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => updateCard(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={card.description}
                    onChange={(e) => updateCard(idx, "description", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Link
                  </label>
                  <input
                    type="text"
                    value={card.link}
                    onChange={(e) => updateCard(idx, "link", e.target.value)}
                    placeholder="/docs/slug ou https://exemplo.com"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.cards.length === 0 && (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-300 rounded-lg">
            Nenhum card adicionado. Clique em "+ Card" para começar.
          </div>
        )}
      </div>
    );
  }

  // Preview Mode - WYSIWYG
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.cards.map((card, idx) => (
        <a
          key={idx}
          href={card.link}
          className="group bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-400 hover:shadow-lg transition-all"
        >
          <div className="mb-4 text-blue-600 group-hover:scale-110 transition-transform">
            {renderIcon(card.icon, "w-10 h-10")}
          </div>
          <h3 className="font-bold text-slate-900 mb-2 text-lg">{card.title}</h3>
          <p className="text-slate-600 text-sm mb-3">{card.description}</p>
          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
            Ver mais
            <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>
      ))}
    </div>
  );
}
