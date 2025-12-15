"use client";

import { Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface AlertBlockData {
  title: string;
  body: string;
  variant: "info" | "success" | "warning" | "error";
}

interface AlertBlockProps {
  data: AlertBlockData;
  isEditing: boolean;
  onChange: (data: AlertBlockData) => void;
}

export default function AlertBlock({ data, isEditing, onChange }: AlertBlockProps) {
  if (isEditing) {
    return (
      <div className="space-y-4">
        <div className="text-xs text-slate-500 uppercase font-medium mb-3">
          ⚠️ Editando Alerta
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tipo de Alerta
          </label>
          <select
            value={data.variant}
            onChange={(e) =>
              onChange({ ...data, variant: e.target.value as AlertBlockData["variant"] })
            }
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="info">Informação (Azul)</option>
            <option value="success">Sucesso (Verde)</option>
            <option value="warning">Atenção (Amarelo)</option>
            <option value="error">Erro (Vermelho)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Título
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onChange({ ...data, title: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ex: Atenção"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mensagem
          </label>
          <textarea
            value={data.body}
            onChange={(e) => onChange({ ...data, body: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descrição do alerta..."
          />
        </div>
      </div>
    );
  }

  // Preview Mode - WYSIWYG
  const variants = {
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-800",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-800",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
  };

  const style = variants[data.variant];

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} border rounded-lg p-5 flex gap-4`}
    >
      <div className="flex-shrink-0 mt-1">{style.icon}</div>
      <div>
        <h3 className="font-bold text-lg mb-2">{data.title}</h3>
        <p className="whitespace-pre-wrap">{data.body}</p>
      </div>
    </div>
  );
}
