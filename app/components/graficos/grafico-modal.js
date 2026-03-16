"use client";

export default function GraficoModal({ aberto, fechar, titulo, children }) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={fechar}>
      <div className="bg-white w-[900px] max-h-[80vh] overflow-auto rounded-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{titulo}</h2>

          <button onClick={fechar} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}