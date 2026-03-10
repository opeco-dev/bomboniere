import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function PUT(request, { params }) {
  try {

    const body = await request.json()

    const produtoId = Number(params.id)

    // remove imagens antigas
    await prisma.produtoImagem.deleteMany({
      where: {
        produtoId
      }
    })

    const produto = await prisma.produto.update({
      where: { id: produtoId },
      data: {
        nome: body.nome,
        descricao: body.descricao,
        preco: parseFloat(body.preco),
        custoUnit: parseFloat(body.custoUnit),
        estoqueMin: parseInt(body.estoqueMin),
        categoria: body.categoria,
        unidade: body.unidade,

        imagens: {
          create: body.imagens.map((url) => ({
            url
          }))
        }
      },
      include: {
        imagens: true
      }
    })

    return NextResponse.json(produto)

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}