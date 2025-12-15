import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const page = await prisma.page.findUnique({
    where: { id },
    include: { blocks: { orderBy: { order: "asc" } } },
  });

  if (!page) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const page = await prisma.page.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      category: data.category,
      isPublished: data.isPublished,
      order: data.order,
    },
  });

  return NextResponse.json(page);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.page.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
