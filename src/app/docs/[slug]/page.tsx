import { prisma } from "@/lib/prisma";
import { BlockRenderer } from "@/components/BlockRenderer";
import { BlockType } from "@/types/blocks";
import { Header } from "@/components/Header";
import { Disclaimer } from "@/components/Disclaimer";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DocPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  const page = await prisma.page.findUnique({
    where: { slug, isPublished: true },
    include: { blocks: { orderBy: { order: "asc" } } },
  });

  if (!page) {
    notFound();
  }
  
  console.log("\n🟢🟢🟢 [USER VIEW] Carregando página:", page.title);
  console.log("🟢 [USER VIEW] Total de blocos:", page.blocks.length);

  return (
    <div className="bg-slate-50">
      <Header />

      {/* Content */}
      <div className="w-full max-w-[1600px] mx-auto px-4 prose prose-sm max-w-none">
        <Disclaimer />
        {page.blocks.map((block: any) => {
          console.log("\n🟢 [USER VIEW] ========== BLOCO", block.id, "==========");
          console.log("🟢 [USER VIEW] Tipo:", block.type);
          console.log("🟢 [USER VIEW] Data do DB (typeof):", typeof block.data);
          console.log("🟢 [USER VIEW] Data do DB (primeiros 200 chars):", 
            typeof block.data === 'string' ? block.data.substring(0, 200) : JSON.stringify(block.data).substring(0, 200)
          );
          
          let parsedData = block.data;
          if (typeof block.data === 'string') {
            try {
              parsedData = JSON.parse(block.data);
              console.log("🟢 [USER VIEW] Parse JSON bem sucedido");
              console.log("🟢 [USER VIEW] Data após parse (typeof):", typeof parsedData);
              if (block.type === 'text' && parsedData.content) {
                console.log("🟢 [USER VIEW] HTML Content (primeiros 200 chars):", parsedData.content.substring(0, 200));
                console.log("🟢 [USER VIEW] Tem tags HTML?", parsedData.content.includes('<'));
                console.log("🟢 [USER VIEW] Tem <strong>?", parsedData.content.includes('<strong>'));
                console.log("🟢 [USER VIEW] Tem <h3>?", parsedData.content.includes('<h3>'));
              }
            } catch (e) {
              console.log("🟢 [USER VIEW] ⚠️ Erro no parse, usando string original");
              parsedData = block.data;
            }
          }
          const blockData = {
            id: block.id,
            type: block.type,
            order: block.order,
            data: parsedData,
          };
          console.log("🟢 [USER VIEW] Enviando para BlockRenderer:", blockData.type);
          return <BlockRenderer key={block.id} block={blockData} />;
        })}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm">© 2025 IoTHub Brasil - Documentação Técnica</p>
        </div>
      </footer>
    </div>
  );
}

export async function generateStaticParams() {
  const pages = await prisma.page.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });

  return pages.map((page: any) => ({
    slug: page.slug,
  }));
}
