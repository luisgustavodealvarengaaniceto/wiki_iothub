import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  // Verificar autenticação
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    // Validar tipo
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Apenas arquivos PDF são permitidos" },
        { status: 400 }
      );
    }

    // Validar tamanho
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande (máximo 50MB)" },
        { status: 400 }
      );
    }

    // Criar nome único para o arquivo
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    
    // Caminho para salvar o arquivo
    const uploadDir = join(process.cwd(), "public", "pdfs");
    
    // Criar diretório se não existir
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Diretório já existe
    }

    const filepath = join(uploadDir, filename);
    
    // Salvar arquivo
    const bytes = await file.arrayBuffer();
    await writeFile(filepath, Buffer.from(bytes));

    // Retornar URL do arquivo
    const url = `/pdfs/${filename}`;
    
    return NextResponse.json({
      url,
      filename: file.name,
      size: file.size,
    });
  } catch (error) {
    console.error("Erro ao fazer upload:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do arquivo" },
      { status: 500 }
    );
  }
}
