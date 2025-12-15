"use client";

interface HeroBlockData {
  title: string;
  subtitle: string;
  bgColor: "blue" | "slate" | "gray";
}

interface HeroBlockProps {
  data: HeroBlockData;
  isEditing: boolean;
  onChange: (data: HeroBlockData) => void;
}

export default function HeroBlock({ data, isEditing, onChange }: HeroBlockProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="text-xs text-slate-500 uppercase font-medium mb-3">
          🎯 Editando Hero
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Título Principal
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Guia Rápido IoTHub"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Subtítulo
          </label>
          <textarea
            value={data.subtitle}
            onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Soluções práticas para integração"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cor de Fundo
          </label>
          <select
            value={data.bgColor}
            onChange={(e) =>
              onChange({ ...data, bgColor: e.target.value as HeroBlockData["bgColor"] })
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="blue">Azul (Padrão)</option>
            <option value="slate">Slate (Neutro)</option>
            <option value="gray">Cinza (Sutil)</option>
          </select>
        </div>
      </div>
    );
  }

  // Preview Mode - WYSIWYG
  const bgColors = {
    blue: "bg-gradient-to-br from-blue-600 to-blue-700",
    slate: "bg-gradient-to-br from-slate-600 to-slate-700",
    gray: "bg-gradient-to-br from-gray-600 to-gray-700",
  };

  return (
    <div
      className={`${bgColors[data.bgColor]} text-white rounded-lg p-12 text-center shadow-lg`}
    >
      <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
      <p className="text-xl text-blue-100">{data.subtitle}</p>
    </div>
  );
}
