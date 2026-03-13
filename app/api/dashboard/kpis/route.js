import { prisma } from "@/app/lib/prisma";
import { getPeriodoDate } from "@/app/lib/dashboardPeriodo";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const periodo = searchParams.get("periodo");

  const dataInicio = getPeriodoDate(periodo);

  const where = { status: "pago" };

  if (dataInicio) {
    where.createdAt = { gte: dataInicio };
  }

  const vendas = await prisma.venda.aggregate({
    where,
    _sum: { total: true },
    _count: true,
  });

  const totalProdutos = await prisma.produto.count();

  return NextResponse.json({
    totalVendas: vendas._sum.total || 0,
    totalPedidos: vendas._count || 0,
    lucroLiquido: vendas._sum.total || 0,
    totalEstoque: totalProdutos,
  });
}
