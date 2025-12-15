import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.block.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.equipment.deleteMany({});
  await prisma.adminUser.deleteMany({});

  // Criar admin padrão
  const adminUser = await prisma.adminUser.create({
    data: {
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123",
      email: process.env.ADMIN_EMAIL || "admin@iothub.local",
    },
  });
  console.log("✅ Admin criado:", adminUser.username);

  // Criar equipamento exemplo
  const equipment1 = await prisma.equipment.create({
    data: {
      name: "JC400",
      icon: "mdi:camera",
      color: "blue",
      order: 0,
    },
  });
  console.log("✅ Equipamento 'JC400' criado");

  // ===== PÁGINAS EXEMPLO =====
  await prisma.page.create({
    data: {
      title: "Bem-vindo à Wiki IoTHub",
      slug: "home",
      description: "Página inicial da documentação",
      icon: "🏠",
      isPublished: true,
      order: 0,
      blocks: {
        create: [
          {
            type: "text",
            order: 0,
            data: JSON.stringify({
              content: "<h1>Bem-vindo à Wiki IoTHub Brasil</h1><p>Esta é a documentação completa da plataforma IoTHub. Use o editor para adicionar mais conteúdo!</p>",
            }),
          },
        ],
      },
    },
  });
  console.log("✅ Página 'Home' criada");

  await prisma.page.create({
    data: {
      title: "Portas e Protocolos",
      slug: "portas-protocolos",
      description: "Configuração técnica de portas e protocolos suportados",
      icon: "🔌",
      equipmentId: equipment1.id,
      isPublished: true,
      order: 1,
      blocks: {
        create: [
          {
            type: "text",
            order: 0,
            data: JSON.stringify({
              content: "<h1>Portas e Protocolos</h1><p>Documentação das portas e protocolos utilizados pela plataforma IoTHub Brasil.</p>",
            }),
          },
        ],
      },
    },
  });
  console.log("✅ Página 'Portas e Protocolos' criada");

  console.log("✨ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
