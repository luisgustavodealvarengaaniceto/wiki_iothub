"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import Link from "next/link";

interface Equipment {
  id: string;
  name: string;
  icon: string;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  equipment?: {
    icon: string;
    name: string;
  };
  isPublished: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicatingPageId, setDuplicatingPageId] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPages();
      fetchEquipments();
    }
  }, [status]);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/pages");
      if (!res.ok) {
        // Em caso de 401, redireciona para login
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const text = await res.text();
        throw new Error(`Falha ao carregar páginas: ${res.status} ${text}`);
      }
      const data = await res.json();
      setPages(data);
    } catch (error) {
      console.error("Erro ao carregar páginas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      const res = await fetch("/api/equipments");
      if (res.ok) {
        const data = await res.json();
        setEquipments(data);
      }
    } catch (error) {
      console.error("Erro ao carregar equipamentos:", error);
    }
  };

  const handleDuplicate = async () => {
    if (!duplicatingPageId) return;

    try {
      const res = await fetch(`/api/pages/${duplicatingPageId}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipmentId: selectedEquipment || null }),
      });

      if (res.ok) {
        setShowDuplicateModal(false);
        setDuplicatingPageId(null);
        setSelectedEquipment("");
        await fetchPages();
      } else {
        alert("Erro ao duplicar página");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao duplicar página");
    }
  };

  const openDuplicateModal = (pageId: string) => {
    setDuplicatingPageId(pageId);
    setSelectedEquipment("");
    setShowDuplicateModal(true);
  };

  const deletePage = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta página?")) return;

    try {
      await fetch(`/api/pages/${id}`, { method: "DELETE" });
      fetchPages();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  if (status === "loading" || loading) {
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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Painel Admin</h1>
            <p className="text-slate-600 mt-1">Gerencie as páginas e conteúdo</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/equipments"
              className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium"
            >
              ⚙️ Gerenciar Equipamentos
            </Link>
            <Link
              href="/admin/pages/new"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Nova Página
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase">
                  Equipamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-900 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pages.map((page, index) => (
                <tr key={page.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{page.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">{page.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {page.equipment ? (
                      <span className="flex items-center gap-2">
                        <i className={`mdi ${page.equipment.icon} text-lg`} />
                        {page.equipment.name}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        page.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {page.isPublished ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-3">
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => openDuplicateModal(page.id)}
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      Duplicar
                    </button>
                    <button
                      onClick={() => deletePage(page.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Duplicação */}
        {showDuplicateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Duplicar Página</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Selecione o Equipamento para a Cópia
                </label>
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900"
                >
                  <option value="">-- Sem equipamento --</option>
                  {equipments.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.icon} {eq.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDuplicate}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                >
                  Duplicar
                </button>
                <button
                  onClick={() => {
                    setShowDuplicateModal(false);
                    setDuplicatingPageId(null);
                    setSelectedEquipment("");
                  }}
                  className="flex-1 px-4 py-3 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 font-medium transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
