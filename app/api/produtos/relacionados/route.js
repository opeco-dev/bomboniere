import { prisma } from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req) {

  const { searchParams } = new URL(req.url)

  const categoria = searchParams.get("categoria")
  const produtoId = searchParams.get("produtoId")

  const produtos = await prisma.produto.findMany({
    where: {
      categoria,
      NOT: {
        id: Number(produtoId)
      }
    },
    take: 4,
    include: {
      imagens: true
    }
  })

  return NextResponse.json(produtos)

}