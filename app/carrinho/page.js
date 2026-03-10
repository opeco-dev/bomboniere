"use client";

import { useCart } from "../components/contexts/CartContext";
import CartItemCard from "../components/ui/CartItemCard";
import BottomNav from "../components/ui/BottomNav";

export default function CarrinhoPage() {
  const { cart, total, clearCart } = useCart();

  const pagarAgora = async () => {
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itens: cart }),
    });

    if (res.ok) {
      alert("Pedido realizado!");
      clearCart();
    }
  };

  return (
    <div className="p-4 pb-32">
      <h1 className="text-xl font-bold mb-4">Carrinho</h1>

      <div className="space-y-3">
        {cart.map((item) => (
          <CartItemCard key={item.id} item={item} />
        ))}
      </div>

      <div className="fixed bottom-12 left-0 right-0 bg-white p-4 shadow">
        <div className="flex justify-between text-lg font-bold mb-3">
          <span>Total:</span>

          <span className="text-[#8E000C]">R$ {total.toFixed(2)}</span>
        </div>

        <button
          onClick={pagarAgora}
          className="w-full bg-[#8E000C] text-white py-3 rounded-full"
        >
          Pagar Agora
        </button>

        <button className="w-full mt-2 bg-gray-400 text-white py-3 rounded-full">
          Pagar Depois
        </button>
      </div>

      <BottomNav/>
    </div>
  );
}
