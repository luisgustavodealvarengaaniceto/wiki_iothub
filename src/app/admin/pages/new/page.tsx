"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { PageBuilder, PageBlock } from "@/components/admin/PageBuilder";
import Link from "next/link";

export default function NewPageForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [equipments, setEquipments] = useState<{ id: string; name: string; icon: string }[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "📄",
    equipmentId: "",
    isPublished: false,
  });
  const [blocks, setBlocks] = useState<PageBlock[]>([]);

  useEffect(() => {
    console.log("🟢 [STATE] Blocos atualizados:", blocks);
    blocks.forEach((block, idx) => {
      console.log(`🟢 [BLOCK ${idx}] Tipo: ${block.type}, Data:`, block.data);
    });
  }, [blocks]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await fetch("/api/equipments");
        if (res.ok) {
          const data = await res.json();
          setEquipments(data);
        }
      } catch (error) {
        console.error("Erro ao carregar equipamentos", error);
      }
    };
    fetchEquipments();
  }, []);

  // PDF upload removido

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔵🔵🔵 [SUBMIT] Botão Salvar Página clicado!");
    console.log("🔵 [SUBMIT] FormData:", formData);
    console.log("🔵 [SUBMIT] Blocks state:", blocks);
    setLoading(true);

    try {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          equipmentId: formData.equipmentId || null,
        }),
      });

      if (res.ok) {
        const newPage = await res.json();
        
        // Salvar blocos se houver
        if (blocks.length > 0) {
          console.log("🔵 [NEW PAGE] Salvando blocos:", blocks.length);
          blocks.forEach((block, idx) => {
            console.log(`🔵 [BLOCK ${idx}] Tipo: ${block.type}`);
            console.log(`🔵 [BLOCK ${idx}] Data original:`, block.data);
            const dataToSend = typeof block.data === "string" ? block.data : JSON.stringify(block.data);
            console.log(`🔵 [BLOCK ${idx}] Data a enviar (stringified):`, dataToSend);
          });
          
          await Promise.all(
            blocks.map((block, index) =>
              fetch("/api/blocks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  pageId: newPage.id,
                  type: block.type,
                  order: index,
                  data: typeof block.data === "string" ? block.data : JSON.stringify(block.data),
                  title: block.type === "code" ? "" : undefined,
                }),
              })
            )
          );
        }
        
        alert("Página criada com sucesso!");
        router.push("/admin/dashboard");
      } else {
        alert("Erro ao criar página");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar página");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, slug });
  };

  if (status === "loading") {
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

      <main className="max-w-4xl mx-auto px-6 py-8">
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

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Nova Página</h1>
          <p className="text-slate-600 mb-8">Crie uma nova página de documentação</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={generateSlug}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900"
                placeholder="Ex: Configuração JC400"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 font-mono text-sm"
                placeholder="configuracao-jc400"
                required
              />
              <p className="text-xs text-slate-500 mt-1">
                A URL será: /docs/{formData.slug || "slug-da-pagina"}
              </p>
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900"
                placeholder="Breve descrição da página"
              />
            </div>

            {/* Ícone */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Ícone (Emoji ou MDI)
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900"
                  placeholder="📄 ou mdi-cog-outline"
                />
                <div className="w-16 h-16 border-2 border-slate-300 rounded-lg flex items-center justify-center bg-slate-50">
                  {formData.icon.startsWith('mdi-') ? (
                    <i className={`mdi ${formData.icon} text-slate-700`} style={{ fontSize: 32 }} />
                  ) : (
                    <span className="text-3xl">{formData.icon}</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Use emoji (📄) ou código MDI (mdi-cog-outline)
              </p>
            </div>

            {/* Equipamento */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Equipamento</label>
              <select
                name="equipmentId"
                value={formData.equipmentId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900"
              >
                <option value="">-- Sem equipamento --</option>
                {equipments.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.icon} {eq.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload de PDF foi removido conforme solicitado */}

            {/* Publicar */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-600"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-900">
                Publicar página imediatamente
              </label>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" variant="primary" loading={loading} disabled={loading}>
                {loading ? "Criando..." : "Criar Página"}
              </Button>
              <Link href="/admin/dashboard">
                <Button type="button" variant="secondary">
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Editor de Conteúdo */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Conteúdo da Página</h2>
            <p className="text-slate-600 mt-1">Cole e formate seu texto aqui (de PDF, Word, ChatGPT, etc)</p>
          </div>

          <PageBuilder
            initialBlocks={blocks}
            onChange={(newBlocks) => setBlocks(newBlocks)}
          />
        </div>
      </main>
    </div>
  );
}
