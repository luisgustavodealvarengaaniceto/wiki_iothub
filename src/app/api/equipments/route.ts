import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const equipments = await prisma.equipment.findMany({
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { pages: true },
        },
      },
    });

    return NextResponse.json(equipments);
  } catch (error) {
    console.error("Erro ao buscar equipamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar equipamentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, color } = body;

    if (!name) {
      return NextResponse.json(
        { message: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    // Contar equipamentos para definir a ordem
    const count = await prisma.equipment.count();

    const equipment = await prisma.equipment.create({
      data: {
        name,
        icon: icon || "⚙️",
        color: color || "blue",
        order: count,
      },
    });

    return NextResponse.json(equipment, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar equipamento:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "Este nome de equipamento já existe" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Erro ao criar equipamento" },
      { status: 500 }
    );
  }
}
