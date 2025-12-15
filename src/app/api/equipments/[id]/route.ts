import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, icon, color } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const equipment = await prisma.equipment.update({
      where: { id },
      data: {
        name,
        icon: icon || "⚙️",
        color: color || "blue",
      },
    });

    return NextResponse.json(equipment);
  } catch (error: any) {
    console.error("Erro ao atualizar equipamento:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Equipamento não encontrado" },
        { status: 404 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Este nome de equipamento já existe" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao atualizar equipamento" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se há páginas associadas
    const pagesCount = await prisma.page.count({
      where: { equipmentId: id },
    });

    if (pagesCount > 0) {
      return NextResponse.json(
        {
          message: `Não é possível deletar este equipamento. Existem ${pagesCount} página(s) associada(s).`,
        },
        { status: 400 }
      );
    }

    await prisma.equipment.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Erro ao deletar equipamento:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { message: "Equipamento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao deletar equipamento" },
      { status: 500 }
    );
  }
}
