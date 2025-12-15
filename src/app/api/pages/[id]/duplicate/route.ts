import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: pageId } = await params;
    const { equipmentId } = await request.json();

    // Buscar página original
    const originalPage = await prisma.page.findUnique({
      where: { id: pageId },
      include: { blocks: true },
    });

    if (!originalPage) {
      return NextResponse.json(
        { error: "Página não encontrada" },
        { status: 404 }
      );
    }

    // Gerar novo slug
    const newSlug = `${originalPage.slug}-copia-${Date.now()}`;

    // Criar nova página
    const newPage = await prisma.page.create({
      data: {
        title: `${originalPage.title} (Cópia)`,
        slug: newSlug,
        description: originalPage.description,
        icon: originalPage.icon,
        equipmentId: equipmentId || null,
        isPublished: false, // Começa como rascunho
        order: originalPage.order,
      },
      include: { blocks: true },
    });

    // Duplicar blocos
    if (originalPage.blocks && originalPage.blocks.length > 0) {
      await Promise.all(
        originalPage.blocks.map((block) =>
          prisma.block.create({
            data: {
              pageId: newPage.id,
              type: block.type,
              order: block.order,
              data: block.data,
            },
          })
        )
      );
    }

    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    console.error("Erro ao duplicar página:", error);
    return NextResponse.json(
      { error: "Erro ao duplicar página" },
      { status: 500 }
    );
  }
}
