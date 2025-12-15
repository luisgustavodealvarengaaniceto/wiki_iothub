import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      icon: true,
      isPublished: true,
      order: true,
      createdAt: true,
      equipmentId: true,
      equipment: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
          order: true,
        },
      },
    },
  });

  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const page = await prisma.page.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      equipmentId: data.equipmentId || null,
      isPublished: data.isPublished ?? false,
      order: data.order ?? 0,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      icon: true,
      isPublished: true,
      order: true,
      createdAt: true,
      equipmentId: true,
      equipment: {
        select: {
          id: true,
          name: true,
          icon: true,
          color: true,
          order: true,
        },
      },
    },
  });

  return NextResponse.json(page);
}
