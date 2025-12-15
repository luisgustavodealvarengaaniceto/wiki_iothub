"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { PageBuilder, PageBlock } from "@/components/admin/PageBuilder";
import Link from "next/link";

interface PageData {
  title: string;
  slug: string;
  description: string;
  icon: string;
  equipmentId: string | null;
  isPublished: boolean;
}

interface Equipment {
  id: string;
  name: string;
  icon: string;
}

export default function EditPageForm({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [formData, setFormData] = useState<PageData>({
    title: "",
    slug: "",
    description: "",
    icon: "📄",
    equipmentId: null,
    isPublished: false,
  });
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchEquipments();
      fetchPage();
    }
  }, [status, id]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/pages/${id}`);
      if (res.ok) {
        const page = await res.json();
        setFormData({
          title: page.title,
          slug: page.slug,
          description: page.description || "",
          icon: page.icon || "📄",
          equipmentId: page.equipmentId || null,
          isPublished: page.isPublished,
        });

        // Carregar blocos e convertê-los para o formato PageBlock
        const dbBlocks = (page.blocks || []).sort((a: any, b: any) => a.order - b.order);
        const convertedBlocks: PageBlock[] = dbBlocks.map((block: any) => {
          let data = block.data;

          // Desempacotar JSON se necessário
          if (typeof data === "string") {
            try {
              let parsed = JSON.parse(data);
              // Continuar desempacotando se for string
              while (typeof parsed === "string") {
                parsed = JSON.parse(parsed);
              }
              data = parsed;
            } catch {
              data = { content: data };
            }
          }

          return {
            id: block.id,
            type: block.type as PageBlock["type"],
            order: block.order,
            data,
          };
        });

        setBlocks(convertedBlocks);
      }
    } catch (error) {
      console.error("Erro ao carregar página:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSaveAll = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validar
    if (!formData.title.trim()) {
      setMessage({ type: "error", text: "Título é obrigatório" });
      return;
    }
    if (!formData.slug.trim()) {
      setMessage({ type: "error", text: "Slug é obrigatório" });
      return;
    }
    if (blocks.length === 0) {
      setMessage({ type: "error", text: "Adicione pelo menos um bloco de conteúdo" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Salvar informações da página
      const pageRes = await fetch(`/api/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!pageRes.ok) {
        const error = await pageRes.json();
        throw new Error(error.message || "Erro ao salvar informações");
      }

      // 2. Salvar blocos de conteúdo
      console.log("🔵🔵🔵 [EDIT PAGE] Salvando blocos!");
      console.log("🔵 [EDIT PAGE] Total de blocos:", blocks.length);
      
      for (const block of blocks) {
        console.log(`🔵 [EDIT BLOCK] Processando bloco ${block.id}, tipo: ${block.type}`);
        console.log(`🔵 [EDIT BLOCK] Data antes stringify:`, block.data);
        
        const data =
          block.type === "text"
            ? JSON.stringify(block.data)
            : block.type === "code"
            ? JSON.stringify(block.data)
            : block.type === "table"
            ? JSON.stringify(block.data)
            : block.type === "image"
            ? JSON.stringify(block.data)
            : "";

        console.log(`🔵 [EDIT BLOCK] Data depois stringify:`, data);

        const blockRes = await fetch("/api/blocks", {
          method: block.id.startsWith("block-") ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: block.id,
            pageId: id,
            type: block.type,
            order: block.order,
            data,
          }),
        });

        if (!blockRes.ok) {
          throw new Error(`Erro ao salvar bloco ${block.type}`);
        }
      }

      // Sucesso total
      setMessage({ type: "success", text: "✅ Página salva com sucesso!" });
      setTimeout(() => setMessage(null), 3000);
      await fetchPage();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      setMessage({ type: "error", text: `❌ ${error.message || "Erro ao salvar página"}` });
    } finally {
      setLoading(false);
    }
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

      <main className="w-full max-w-[1600px] mx-auto px-4 py-8">
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

        {/* Messages */}
        {message && (
          <div className={`mb-6 px-4 py-3 rounded-lg border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        {/* Página Info */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Editar Página</h1>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900"
                placeholder="Ex: Configuração JC400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Slug (URL) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900 font-mono text-sm"
                placeholder="configuracao-jc400"
                required
              />
              <p className="text-xs text-slate-500 mt-1">URL: /docs/{formData.slug || "slug"}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Equipamento</label>
              <select
                value={formData.equipmentId || ""}
                onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value || null })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900"
              >
                <option value="">-- Selecione um equipamento --</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.icon} {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 text-slate-900"
                placeholder="Breve descrição"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-5 h-5 border-slate-300 rounded text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-900">
                Página publicada
              </label>
            </div>
          </div>
        </div>

        {/* Page Builder - Gerenciador de Blocos */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Conteúdo da Página</h2>
          <PageBuilder
            initialBlocks={blocks}
            onChange={setBlocks}
          />
        </div>

        {/* Botão único de salvar tudo */}
        <div className="flex gap-4 mb-8">
          <Button
            type="button"
            variant="primary"
            loading={loading}
            onClick={handleSaveAll}
          >
            {loading ? "Salvando..." : "💾 Salvar Página"}
          </Button>
          <Link href="/admin/dashboard">
            <Button type="button" variant="secondary">
              Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
