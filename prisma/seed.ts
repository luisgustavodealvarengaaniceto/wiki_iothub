import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpar dados existentes
  await prisma.block.deleteMany({});
  await prisma.page.deleteMany({});
  await prisma.adminUser.deleteMany({});

  // Criar admin padrão
  const adminUser = await prisma.adminUser.create({
    data: {
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123", // Em produção, hash com bcrypt
      email: process.env.ADMIN_EMAIL || "admin@iothub.local",
    },
  });
  console.log("✅ Admin criado:", adminUser.username);

  // ===== PAGE 1: PORTAS E PROTOCOLOS =====
  const portasPage = await prisma.page.create({
    data: {
      title: "Portas e Protocolos",
      slug: "portas-protocolos",
      description: "Configuração técnica de portas e protocolos suportados",
      icon: "🔌",
      category: "portas",
      isPublished: true,
      order: 1,
      blocks: {
        create: [
          {
            type: "heading",
            order: 0,
            data: JSON.stringify({
              level: 1,
              text: "Portas e Protocolos",
            }),
          },
          {
            type: "text",
            order: 1,
            data: JSON.stringify({
              content:
                "Documentação completa das portas e protocolos utilizados pela plataforma IoTHub Brasil.",
              align: "left",
            }),
          },
          {
            type: "heading",
            order: 2,
            data: JSON.stringify({
              level: 2,
              text: "JIMI (JC400 / JC261)",
            }),
          },
          {
            type: "table",
            order: 3,
            data: JSON.stringify({
              headers: ["Protocolo", "Porta", "Tipo", "Fonte"],
              rows: [
                ["JIMI", "21100", "TCP", "Getting Started"],
              ],
            }),
          },
          {
            type: "heading",
            order: 4,
            data: JSON.stringify({
              level: 2,
              text: "JT/T (JC450 / JC181)",
            }),
          },
          {
            type: "table",
            order: 5,
            data: JSON.stringify({
              headers: ["Protocolo", "Porta", "Tipo", "Fonte"],
              rows: [
                ["JT/T", "21122", "TCP", "Getting Started"],
              ],
            }),
          },
          {
            type: "heading",
            order: 6,
            data: JSON.stringify({
              level: 2,
              text: "Mídia (Streaming)",
            }),
          },
          {
            type: "table",
            order: 7,
            data: JSON.stringify({
              headers: ["Tipo", "Porta", "Protocolo", "Descrição"],
              rows: [
                ["Streaming Entrada", "1936", "RTMP", "Entrada de media ao vivo"],
                [
                  "Streaming Saída",
                  "8881",
                  "HTTP-FLV",
                  "Saída de stream para cliente",
                ],
              ],
            }),
          },
          {
            type: "heading",
            order: 8,
            data: JSON.stringify({
              level: 2,
              text: "FTP (Upload de Mídia JC450)",
            }),
          },
          {
            type: "table",
            order: 9,
            data: JSON.stringify({
              headers: ["Tipo", "Porta", "Descrição", "Fonte"],
              rows: [
                ["FTP Controle", "21", "Conexão de controle", "FTP Guide"],
                [
                  "FTP Passivo",
                  "31100-31110",
                  "Range para modo passivo",
                  "FTP Guide",
                ],
              ],
            }),
          },
          {
            type: "alert",
            order: 10,
            data: JSON.stringify({
              type: "warning",
              title: "Importante",
              message:
                "Certifique-se de que as portas não estão bloqueadas por firewall. Entre em contato com o time de infraestrutura se necessário.",
            }),
          },
        ],
      },
    },
  });
  console.log("✅ Página 'Portas e Protocolos' criada");

  // ===== PAGE 2: ERRO: DEVICE NOT REGISTERED (CODE 301) =====
  const troubleshootPage = await prisma.page.create({
    data: {
      title: "Erro: Device not registered (Code 301)",
      slug: "erro-device-not-registered",
      description: "Solução de problemas para o código de erro 301",
      icon: "🆘",
      category: "troubleshooting",
      isPublished: true,
      order: 2,
      blocks: {
        create: [
          {
            type: "heading",
            order: 0,
            data: JSON.stringify({
              level: 1,
              text: "Erro: Device not registered (Code 301)",
            }),
          },
          {
            type: "alert",
            order: 1,
            data: JSON.stringify({
              type: "error",
              title: "O que significa?",
              message:
                "O Gateway não encontrou o IMEI do dispositivo no Redis. Isso impede a roteamento correto das mensagens.",
            }),
          },
          {
            type: "heading",
            order: 2,
            data: JSON.stringify({
              level: 2,
              text: "Diagnóstico Rápido",
            }),
          },
          {
            type: "heading",
            order: 3,
            data: JSON.stringify({
              level: 3,
              text: "✅ Solução 1: Verificar Status do Dispositivo",
            }),
          },
          {
            type: "text",
            order: 4,
            data: JSON.stringify({
              content:
                "Verifique os LEDs do dispositivo. Se estiverem vermelhos ou apagados, o gateway não consegue se comunicar.",
              align: "left",
            }),
          },
          {
            type: "code",
            order: 5,
            data: JSON.stringify({
              language: "json",
              code: JSON.stringify(
                {
                  imei: "358975043000001",
                  status: "online",
                  lastSeen: "2025-12-10T10:30:00Z",
                  gateway: "tracker-gate-v1",
                },
                null,
                2
              ),
            }),
          },
          {
            type: "heading",
            order: 6,
            data: JSON.stringify({
              level: 3,
              text: "✅ Solução 2: Verificar Logs do Gateway",
            }),
          },
          {
            type: "text",
            order: 7,
            data: JSON.stringify({
              content:
                "Para dispositivos JIMI (protocolo JIMI), consulte os logs do <strong>tracker-gate-v1</strong>. Para JT/T, use <strong>jimi-gateway-450</strong>.",
              align: "left",
            }),
          },
          {
            type: "code",
            order: 8,
            data: JSON.stringify({
              language: "json",
              code: JSON.stringify(
                {
                  log: "Device IMEI 358975043000001 not found in Redis cache",
                  timestamp: "2025-12-10T10:25:00Z",
                  service: "tracker-gate-v1",
                  level: "ERROR",
                },
                null,
                2
              ),
            }),
          },
          {
            type: "heading",
            order: 9,
            data: JSON.stringify({
              level: 3,
              text: "✅ Solução 3: Aguardar Evento de LOGIN",
            }),
          },
          {
            type: "alert",
            order: 10,
            data: JSON.stringify({
              type: "info",
              title: "Importante",
              message:
                "Sempre aguarde o evento de LOGIN no Webhook <strong>ANTES</strong> de enviar comandos. Caso contrário, os comandos serão perdidos.",
            }),
          },
          {
            type: "code",
            order: 11,
            data: JSON.stringify({
              language: "json",
              code: JSON.stringify(
                {
                  event: "LOGIN",
                  imei: "358975043000001",
                  timestamp: "2025-12-10T10:30:00Z",
                  status: "success",
                },
                null,
                2
              ),
            }),
          },
          {
            type: "alert",
            order: 12,
            data: JSON.stringify({
              type: "success",
              title: "Dúvida Resolvida?",
              message:
                "Se o problema persistir, entre em contato com o suporte técnico com os logs anexados.",
            }),
          },
        ],
      },
    },
  });
  console.log("✅ Página 'Troubleshooting' criada");

  // ===== PAGE 3: DIFERENÇA DE COMANDOS =====
  const comandosPage = await prisma.page.create({
    data: {
      title: "Diferença de Comandos: JIMI vs JT/T",
      slug: "diferenca-comandos",
      description: "Comparação de comandos entre protocolos JIMI e JT/T",
      icon: "⚙️",
      category: "comandos",
      isPublished: true,
      order: 3,
      blocks: {
        create: [
          {
            type: "heading",
            order: 0,
            data: JSON.stringify({
              level: 1,
              text: "Diferença de Comandos: JIMI vs JT/T",
            }),
          },
          {
            type: "text",
            order: 1,
            data: JSON.stringify({
              content:
                "Os protocolos JIMI e JT/T possuem estruturas de comando diferentes. Abaixo você encontra as principais diferenças.",
              align: "left",
            }),
          },
          {
            type: "heading",
            order: 2,
            data: JSON.stringify({
              level: 2,
              text: "Protocolo JIMI",
            }),
          },
          {
            type: "alert",
            order: 3,
            data: JSON.stringify({
              type: "info",
              title: "Padrão JIMI",
              message:
                "O protocolo JIMI utiliza <strong>proNo: 128</strong> como identificador padrão para a maioria dos comandos.",
            }),
          },
          {
            type: "table",
            order: 4,
            data: JSON.stringify({
              headers: ["Comando", "proNo", "Descrição", "Exemplo"],
              rows: [
                [
                  "Tudo (Genérico)",
                  "128",
                  "Parâmetro universal",
                  'proNo: 128, param: "..."',
                ],
                [
                  "Localização",
                  "128",
                  "Solicita posição GPS",
                  "proNo: 128, action: GPS",
                ],
              ],
            }),
          },
          {
            type: "heading",
            order: 5,
            data: JSON.stringify({
              level: 2,
              text: "Protocolo JT/T",
            }),
          },
          {
            type: "alert",
            order: 6,
            data: JSON.stringify({
              type: "warning",
              title: "Padrão JT/T",
              message:
                "O protocolo JT/T usa <strong>proNo específicos</strong> para cada tipo de comando. Não existe 'proNo universal'.",
            }),
          },
          {
            type: "table",
            order: 7,
            data: JSON.stringify({
              headers: ["Comando", "proNo", "Descrição", "Exemplo"],
              rows: [
                [
                  "Live Video",
                  "37121",
                  "Ativa transmissão de vídeo ao vivo",
                  "proNo: 37121, action: START",
                ],
                [
                  "FTP Upload",
                  "37382",
                  "Upload de arquivo via FTP",
                  "proNo: 37382, server: ftp.server.com",
                ],
                [
                  "Localização",
                  "37121",
                  "Solicita posição GPS",
                  "proNo: 37121, type: GPS",
                ],
              ],
            }),
          },
          {
            type: "heading",
            order: 8,
            data: JSON.stringify({
              level: 2,
              text: "Exemplo Comparativo",
            }),
          },
          {
            type: "grid",
            order: 9,
            data: JSON.stringify({
              columns: 2,
              gap: "md",
            }),
          },
          {
            type: "heading",
            order: 10,
            data: JSON.stringify({
              level: 3,
              text: "JIMI",
            }),
          },
          {
            type: "code",
            order: 11,
            data: JSON.stringify({
              language: "json",
              code: JSON.stringify(
                {
                  protocol: "JIMI",
                  command: {
                    imei: "358975043000001",
                    proNo: 128,
                    action: "getLiveVideo",
                    params: {
                      duration: 60,
                    },
                  },
                },
                null,
                2
              ),
            }),
          },
          {
            type: "heading",
            order: 12,
            data: JSON.stringify({
              level: 3,
              text: "JT/T",
            }),
          },
          {
            type: "code",
            order: 13,
            data: JSON.stringify({
              language: "json",
              code: JSON.stringify(
                {
                  protocol: "JT/T",
                  command: {
                    imei: "358975043000001",
                    proNo: 37121,
                    action: "getLiveVideo",
                    params: {
                      duration: 60,
                    },
                  },
                },
                null,
                2
              ),
            }),
          },
          {
            type: "alert",
            order: 14,
            data: JSON.stringify({
              type: "success",
              title: "Dica",
              message:
                "Sempre verifique o protocolo do seu dispositivo antes de enviar comandos. Use a tabela de conversão acima.",
            }),
          },
        ],
      },
    },
  });
  console.log("✅ Página 'Diferença de Comandos' criada");

  // ===== PAGE 4: HOME (Com cards visuais) =====
  const homePage = await prisma.page.create({
    data: {
      title: "Home",
      slug: "home",
      description: "Página inicial - IoTHub Brasil",
      icon: "🏠",
      category: "general",
      isPublished: true,
      order: 0,
      blocks: {
        create: [
          {
            type: "hero",
            order: 0,
            data: JSON.stringify({
              title: "IoTHub Brasil",
              subtitle: "Qual seu erro ou dúvida hoje?",
            }),
          },
          {
            type: "grid",
            order: 1,
            data: JSON.stringify({
              columns: 2,
              gap: "lg",
            }),
          },
          {
            type: "card",
            order: 2,
            data: JSON.stringify({
              title: "📷 Série JC400",
              icon: "📷",
              description:
                "Tudo sobre o protocolo JIMI para a série JC400/JC261",
              link: "/docs/portas-protocolos",
              buttonText: "Saiba Mais",
              color: "blue",
            }),
          },
          {
            type: "card",
            order: 3,
            data: JSON.stringify({
              title: "📹 Série JC450/181",
              icon: "📹",
              description: "Protocolo JT/T para JC450/JC181 com streaming",
              link: "/docs/portas-protocolos",
              buttonText: "Saiba Mais",
              color: "purple",
            }),
          },
          {
            type: "card",
            order: 4,
            data: JSON.stringify({
              title: "🛠️ API & Webhook",
              icon: "🛠️",
              description: "Integração avançada com webhooks e API REST",
              link: "/docs/diferenca-comandos",
              buttonText: "Saiba Mais",
              color: "green",
            }),
          },
          {
            type: "card",
            order: 5,
            data: JSON.stringify({
              title: "🆘 Troubleshooting",
              icon: "🆘",
              description: "Resolução de erros e problemas comuns",
              link: "/docs/erro-device-not-registered",
              buttonText: "Saiba Mais",
              color: "red",
            }),
          },
        ],
      },
    },
  });
  console.log("✅ Página 'Home' criada");

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
