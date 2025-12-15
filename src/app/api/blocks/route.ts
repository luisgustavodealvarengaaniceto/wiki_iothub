import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  
  console.log("\n🟣🟣🟣 [API POST] Nova requisição");
  console.log("🟣 [API POST] Tipo de bloco:", data.type);
  console.log("🟣 [API POST] data.data (typeof):", typeof data.data);
  console.log("🟣 [API POST] data.data (primeiros 200 chars):", 
    typeof data.data === 'string' ? data.data.substring(0, 200) : JSON.stringify(data.data).substring(0, 200)
  );
  
  if (data.type === 'text' && typeof data.data === 'string') {
    console.log("🟣 [API POST] É texto! Verificando HTML...");
    console.log("🟣 [API POST] Tem <strong>?", data.data.includes('<strong>'));
    console.log("🟣 [API POST] Tem <h3>?", data.data.includes('<h3>'));
    try {
      const parsed = JSON.parse(data.data);
      if (parsed.content) {
        console.log("🟣 [API POST] Content dentro do JSON (primeiros 200 chars):", parsed.content.substring(0, 200));
      }
    } catch (e) {
      console.log("🟣 [API POST] data.data não é JSON parseavel");
    }
  }

  const block = await prisma.block.create({
    data: {
      pageId: data.pageId,
      type: data.type,
      order: data.order,
      data: data.data,
    },
  });
  
  console.log("🟣 [API POST] Bloco criado com ID:", block.id);
  console.log("🟣 [API POST] Data salvo no DB (primeiros 200 chars):", 
    typeof block.data === 'string' ? block.data.substring(0, 200) : JSON.stringify(block.data).substring(0, 200)
  );

  return NextResponse.json(block);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  
  console.log("\n🟣🟣🟣 [API PUT] Atualização de bloco");
  console.log("🟣 [API PUT] Block ID:", data.id);
  console.log("🟣 [API PUT] Tipo de bloco:", data.type);
  console.log("🟣 [API PUT] data.data (typeof):", typeof data.data);
  console.log("🟣 [API PUT] data.data (primeiros 200 chars):", 
    typeof data.data === 'string' ? data.data.substring(0, 200) : JSON.stringify(data.data).substring(0, 200)
  );
  
  if (data.type === 'text' && typeof data.data === 'string') {
    console.log("🟣 [API PUT] É texto! Verificando HTML...");
    console.log("🟣 [API PUT] Tem <strong>?", data.data.includes('<strong>'));
    console.log("🟣 [API PUT] Tem <h3>?", data.data.includes('<h3>'));
    try {
      const parsed = JSON.parse(data.data);
      if (parsed.content) {
        console.log("🟣 [API PUT] Content dentro do JSON (primeiros 200 chars):", parsed.content.substring(0, 200));
      }
    } catch (e) {
      console.log("🟣 [API PUT] data.data não é JSON parseavel");
    }
  }

  const block = await prisma.block.update({
    where: { id: data.id },
    data: {
      type: data.type,
      order: data.order,
      data: data.data,
    },
  });
  
  console.log("🟣 [API PUT] Bloco atualizado com sucesso");
  console.log("🟣 [API PUT] Data salvo no DB (primeiros 200 chars):", 
    typeof block.data === 'string' ? block.data.substring(0, 200) : JSON.stringify(block.data).substring(0, 200)
  );

  return NextResponse.json(block);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }

  await prisma.block.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
