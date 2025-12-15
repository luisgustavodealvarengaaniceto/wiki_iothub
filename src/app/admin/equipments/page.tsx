"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import Link from "next/link";

interface Equipment {
  id: string;
  name: string;
  icon: string;
  color: string;
  order: number;
}

const COLORS = [
  { value: "blue", label: "🔵 Azul" },
  { value: "red", label: "🔴 Vermelho" },
  { value: "green", label: "🟢 Verde" },
  { value: "yellow", label: "🟡 Amarelo" },
  { value: "purple", label: "🟣 Roxo" },
  { value: "pink", label: "🩷 Rosa" },
  { value: "slate", label: "⚫ Cinza" },
];

const ICONS = [
  "mdi-cog", "mdi-wrench", "mdi-hammer", "mdi-flash", "mdi-monitor", "mdi-cellphone",
  "mdi-power-plug", "mdi-battery", "mdi-wifi", "mdi-keyboard",
  "mdi-laptop", "mdi-sliders", "mdi-clock", "mdi-chart-box", "mdi-chart-line",
  "mdi-microscope", "mdi-flask", "mdi-dna", "mdi-target", "mdi-dice-multiple"
];

const getIconLabel = (iconClass: string): string => {
  const labels: { [key: string]: string } = {
    "mdi-cog": "Engrenagem",
    "mdi-wrench": "Chave",
    "mdi-hammer": "Martelo",
    "mdi-flash": "Raio",
    "mdi-monitor": "Monitor",
    "mdi-cellphone": "Celular",
    "mdi-power-plug": "Plugue",
    "mdi-battery": "Bateria",
    "mdi-wifi": "WiFi",
    "mdi-keyboard": "Teclado",
    "mdi-laptop": "Notebook",
    "mdi-sliders": "Controle",
    "mdi-clock": "Relógio",
    "mdi-chart-box": "Gráfico",
    "mdi-chart-line": "Linha",
    "mdi-microscope": "Microscópio",
    "mdi-flask": "Frasco",
    "mdi-dna": "DNA",
    "mdi-target": "Alvo",
    "mdi-dice-multiple": "Dados",
  };
  return labels[iconClass] || iconClass;
};

export default function EquipmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "mdi-cog",
    color: "blue",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchEquipments();
    }
  }, [status]);

  const fetchEquipments = async () => {
    try {
      const res = await fetch("/api/equipments");
      if (res.ok) {
        const data = await res.json();
        setEquipments(data.sort((a: Equipment, b: Equipment) => a.order - b.order));
      }
    } catch (error) {
      console.error("Erro ao carregar equipamentos:", error);
      setMessage({ type: "error", text: "Erro ao carregar equipamentos" });
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setMessage({ type: "error", text: "Nome do equipamento é obrigatório" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/equipments/${editingId}` : "/api/equipments";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage({
          type: "success",
          text: editingId ? "✅ Equipamento atualizado!" : "✅ Equipamento criado!",
        });
        setFormData({ name: "", icon: "⚙️", color: "blue" });
        setEditingId(null);
        setTimeout(() => setMessage(null), 3000);
        await fetchEquipments();
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: `❌ Erro: ${error.message}` });
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage({ type: "error", text: "❌ Erro ao salvar equipamento" });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setFormData({
      name: equipment.name,
      icon: equipment.icon,
      color: equipment.color,
    });
    setEditingId(equipment.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este equipamento?")) return;

    try {
      const res = await fetch(`/api/equipments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ type: "success", text: "✅ Equipamento deletado!" });
        setTimeout(() => setMessage(null), 3000);
        await fetchEquipments();
      } else {
        setMessage({ type: "error", text: "❌ Erro ao deletar equipamento" });
      }
    } catch (error) {
      console.error("Erro:", error);
      setMessage({ type: "error", text: "❌ Erro ao deletar equipamento" });
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", icon: "mdi-cog", color: "blue" });
    setEditingId(null);
  };

  if (status === "loading" || fetching) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-slate-900">Carregando...</div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/admin/dashboard"
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </Link>
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">
            {editingId ? "Editar Equipamento" : "Novo Equipamento"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900"
                placeholder="Ex: JC400, JC450, JC600..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Código MDI do Ícone *
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-mono text-sm"
                  placeholder="Ex: mdi-cog, mdi-wrench, mdi-hammer..."
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Encontre ícones em{" "}
                  <a
                    href="https://materialdesignicons.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    materialdesignicons.com
                  </a>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Cor
                </label>
                <div className="space-y-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`w-full p-3 rounded-lg border-2 text-left font-medium transition ${
                        formData.color === color.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Preview
              </label>
              <div className="p-4 border border-slate-300 rounded-lg bg-slate-50 flex items-center gap-4">
                <i className={`mdi ${formData.icon} text-4xl text-slate-900`} />
                <div>
                  <p className="text-sm text-slate-600 font-medium">{formData.name}</p>
                  <p className="text-xs text-slate-500 mt-1">Cor: {formData.color}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="primary" loading={loading}>
                {loading ? "Salvando..." : editingId ? "Atualizar" : "Criar"}
              </Button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 font-medium"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de equipamentos */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Equipamentos ({equipments.length})
          </h2>

          {equipments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>Nenhum equipamento criado ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Ícone
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Cor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                      Páginas
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {equipments.map((equipment) => (
                    <tr key={equipment.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <i className={`mdi ${equipment.icon} text-2xl text-slate-900`} />
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {equipment.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {COLORS.find((c) => c.value === equipment.color)?.label}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <Link
                          href={`/admin/dashboard?equipment=${equipment.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          Ver páginas →
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(equipment)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(equipment.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          🗑️ Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
