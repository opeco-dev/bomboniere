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

  const vendas = await prisma.venda.findMany({
    where,
    select: {
      total: true,
      createdAt: true,
    },
  });

  const mapa = {};

  vendas.forEach((v) => {
    const dia = new Date(v.createdAt).toISOString().slice(0, 10);

    if (!mapa[dia]) mapa[dia] = 0;

    mapa[dia] += v.total;
  });

  const dados = Object.keys(mapa).map((d) => ({
    data: d,
    lucro: mapa[d],
  }));

  return NextResponse.json(dados);
}
