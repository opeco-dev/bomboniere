"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../components/contexts/CartContext";
import CartItemCard from "../components/ui/CartItemCard";
import BottomNav from "../components/ui/BottomNav";

export default function CarrinhoPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();

  const pagarAgora = async () => {
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itens: cart }),
    });

    const data = await res.json();

    if (res.ok) {
      clearCart();

      router.push(`/checkout/${data.id}`);
    }
  };

  async function pagarDepois() {
    const res = await fetch("/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        itens: cart,
        status: "aberta",
      }),
    });

    if (!res.ok) return;

    clearCart();

    router.push("/pedidos");
  }

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

        <button
          onClick={pagarDepois}
          className="w-full border-2 rounded-full my-3 py-3"
        >
          Pagar depois
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
