import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const vendasHoje = await prisma.venda.aggregate({
    _sum: { total: true },
    where: {
      dataVenda: {
        gte: hoje
      }
    }
  })

  const totalProdutos = await prisma.produto.count()

  const itensEstoque = await prisma.estoque.aggregate({
    _sum: { quantidade: true }
  })

  const topProdutos = await prisma.itemVenda.groupBy({
    by: ['produtoId'],
    _sum: {
      quantidade: true,
      subtotal: true
    },
    orderBy: {
      _sum: {
        quantidade: 'desc'
      }
    },
    take: 5
  })

  const produtos = await prisma.produto.findMany()

  const produtosVendidos = topProdutos.map((item) => {
    const produto = produtos.find((p) => p.id === item.produtoId)

    return {
      nome: produto?.nome || 'Produto',
      categoria: produto?.categoria || '',
      quantidade: item._sum.quantidade,
      total: item._sum.subtotal
    }
  })

  return Response.json({
    vendasHoje: vendasHoje._sum.total || 0,
    totalProdutos,
    itensEstoque: itensEstoque._sum.quantidade || 0,
    produtosVendidos
  })
}
