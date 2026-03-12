"use client";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmColor = "red"
}) {
  if (!open) return null;

  const colors = {
    red: "bg-[#8E000C] hover:bg-red-900",
    green: "bg-green-600 hover:bg-green-700"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-white w-[90%] max-w-sm rounded-2xl p-6 shadow-lg">

        <h2 className="text-lg font-bold text-gray-800">
          {title}
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          {description}
        </p>

        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 rounded-full"
          >
            Voltar
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 text-white py-2 rounded-full ${colors[confirmColor]}`}
          >
            Confirmar
          </button>

        </div>

      </div>
    </div>
  );
}