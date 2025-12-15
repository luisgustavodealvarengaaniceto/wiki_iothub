import { prisma } from "@/lib/prisma";
import { BlockRenderer } from "@/components/BlockRenderer";
import { BlockType } from "@/types/blocks";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";

export default async function Home() {
  const allPages = await prisma.page.findMany({
    where: { isPublished: true, slug: { not: "home" } },
    orderBy: [{ order: "asc" }],
    include: { equipment: true },
  });

  // Agrupar páginas por equipamento
  const pagesByEquipment: { [key: string]: typeof allPages } = {};
  const equipmentList: { id: string; name: string; icon: string }[] = [];

  allPages.forEach((page) => {
    const equipmentKey = page.equipmentId || "sem-equipamento";
    if (!pagesByEquipment[equipmentKey]) {
      pagesByEquipment[equipmentKey] = [];
      if (page.equipment) {
        equipmentList.push({
          id: page.equipment.id,
          name: page.equipment.name,
          icon: page.equipment.icon,
        });
      }
    }
    pagesByEquipment[equipmentKey].push(page);
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white py-20 relative overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-96 -mb-96"></div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight !text-white">
            IoTHub Brasil
            <br />
            Guia Rápido e Soluções Práticas
          </h1>
          <p className="text-xl !text-white mb-8 max-w-2xl mx-auto">
            Travou na integração? Encontre aqui as respostas para dúvidas pontuais, erros comuns e configurações essenciais de forma direta.
          </p>

          {/* Link para Doc Oficial */}
          <a
            href="https://docs.jimicloud.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 transition mb-8 text-sm font-medium"
          >
            Precisa de detalhes profundos? Acesse a Documentação Oficial Completa
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <SearchBar placeholder="Digite seu erro (ex: 301) ou modelo (ex: JC450)..." />
          </div>
        </div>
      </section>

      {/* Main Documentation Cards */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Acesso Rápido por Equipamento
          </h2>

          {allPages.length > 0 ? (
            <div className="space-y-16">
              {equipmentList.map((equipment) => (
                <div key={equipment.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <i className={`mdi ${equipment.icon} text-4xl text-slate-900`} />
                    <h3 className="text-2xl font-bold text-slate-900">{equipment.name}</h3>
                  </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {pagesByEquipment[equipment.id]?.map((page) => (
                    <Card
                      key={page.id}
                      icon={equipment.icon}
                      title={page.title}
                      description={page.description}
                      href={`/docs/${page.slug}`}
                      color="blue"
                    />
                  ))}
                </div>
              </div>
            ))}

            {pagesByEquipment["sem-equipamento"]?.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Sem Equipamento</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {pagesByEquipment["sem-equipamento"].map((page) => (
                    <Card
                      key={page.id}
                      icon={page.icon}
                      title={page.title}
                      description={page.description}
                      href={`/docs/${page.slug}`}
                      color="blue"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>Nenhuma página publicada ainda</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Por que usar este Guia?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sem Enrolação</h3>
              <p className="text-slate-600">
                Respostas diretas para problemas pontuais. Sem precisar ler 50 páginas de manual.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Troubleshooting</h3>
              <p className="text-slate-600">
                Erros comuns e soluções práticas. Configurações essenciais sem complicação.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 hover:border-blue-300 transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Complementar</h3>
              <p className="text-slate-600">
                Para detalhes técnicos completos, sempre consulte a documentação oficial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">IoTHub Brasil</h4>
              <p className="text-sm">
                Guia rápido de consulta e troubleshooting para integradores
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Guias Rápidos</h4>
              <ul className="text-sm space-y-2">
                {allPages.slice(0, 3).map((page) => (
                  <li key={page.id}>
                    <Link
                      href={`/docs/${page.slug}`}
                      className="hover:text-blue-400 transition"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Admin</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <Link href="/admin" className="hover:text-blue-400 transition">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-blue-400 transition">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Recursos</h4>
              <ul className="text-sm space-y-2">
                <li>
                  <a
                    href="https://docs.jimicloud.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition inline-flex items-center gap-1"
                  >
                    Documentação Oficial
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
                <li>
                  <span className="text-slate-400">Suporte Técnico</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2025 IoTHub Brasil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
