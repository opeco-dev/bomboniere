import { prisma } from '../../lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request) {

  const body = await request.json()

  const itens = body.itens

  const total = itens.reduce(
    (sum, i) => sum + i.preco * i.quantidade,
    0
  )

  const venda = await prisma.venda.create({

    data: {

      total,

      itens: {
        create: itens.map(i => ({
          produtoId: i.id,
          quantidade: i.quantidade,
          precoUnit: i.preco,
          subtotal: i.preco * i.quantidade
        }))
      }

    }

  })

  return NextResponse.json(venda)

}