"use client";

export default function FiltroPeriodo({ periodo, setPeriodo }) {
  const opcoes = [
    { label: "Todos", value: "all" },
    { label: "12 Meses", value: "12m" },
    { label: "30 Dias", value: "30d" },
    { label: "7 Dias", value: "7d" },
    { label: "Hoje", value: "today" },
  ];

  return (
    <div className="flex gap-2">
      {opcoes.map((o) => (
        <button
          key={o.value}
          onClick={() => setPeriodo(o.value)}
          className={`px-3 py-1 rounded-full text-sm
        ${periodo === o.value ? "bg-[#8E000C] text-white" : "bg-gray-200"}
        `}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
