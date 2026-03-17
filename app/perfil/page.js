"use client";

import { useState } from "react";
import BottomNav from "../components/ui/BottomNav";
import { useSession, signOut } from "next-auth/react";
import { CircleUser, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [modal, setModal] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);

  const [value, setValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");

  const role = session?.user?.role || "user";
  const roleLabel = role === "admin" ? "Administrador" : "Cliente";

  const nome = session?.user?.name || "";
  const email = session?.user?.email || "";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  function validarSenha(senha) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    return regex.test(senha);
  }

  const openModal = (tipo) => {
    setModal(tipo);
    setError("");
    setValue(tipo === "nome" ? nome : tipo === "email" ? email : "");
    setConfirmPassword("");
  };

  const handleSubmit = () => {
    setError("");

    if (modal === "senha") {
      if (value !== confirmPassword) {
        setError("As senhas não coincidem");
        return;
      }

      if (!validarSenha(value)) {
        setError(
          "Senha fraca. Use 8+ caracteres, maiúscula, número e símbolo.",
        );
        return;
      }
    }

    setConfirmModal(true);
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/usuario/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: modal,
          valor: value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao atualizar");
        return;
      }

      setConfirmModal(false);
      setModal(null);
      setValue("");
      setConfirmPassword("");

      /* encerra sessão e manda para login */

      await signOut({
        redirect: true,
        callbackUrl: "/login",
      });
    } catch (err) {
      console.error(err);
      setError("Erro inesperado");
    }
  };

  return (
    <div className="p-4 pb-28 max-w-xl mx-auto">
      {/* USER INFO */}

      <div className="flex flex-col items-center my-8">
        <CircleUser color="#8E000C" size={70} />

        <span className="font-semibold text-[#8E000C] mt-2">{nome}</span>

        <span className="text-sm text-gray-500">{email}</span>

        <span className="text-xs mt-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600">
          {roleLabel}
        </span>
      </div>

      {/* ACTIONS */}

      <div className="flex flex-col gap-3">
        <button
          onClick={() => openModal("nome")}
          className="border rounded-lg py-3"
        >
          Editar Nome
        </button>

        <button
          onClick={() => openModal("email")}
          className="border rounded-lg py-3"
        >
          Alterar Email
        </button>

        <button
          onClick={() => openModal("senha")}
          className="border rounded-lg py-3"
        >
          Redefinir Senha
        </button>

        <button
          onClick={handleLogout}
          className="border border-red-500 text-red-600 rounded-lg py-3"
        >
          Encerrar Sessão
        </button>
      </div>

      {/* MODAL EDITAR */}

      {modal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              {modal === "nome" && "Editar Nome"}
              {modal === "email" && "Alterar Email"}
              {modal === "senha" && "Redefinir Senha"}
            </h2>

            {/* INPUT */}

            <div className="relative mb-3">
              <input
                type={
                  modal === "senha"
                    ? showPassword
                      ? "text"
                      : "password"
                    : "text"
                }
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 pr-10"
                placeholder={
                  modal === "senha" ? "Nova senha" : "Digite o novo valor"
                }
              />

              {modal === "senha" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>

            {/* CONFIRMAR SENHA */}

            {modal === "senha" && (
              <div className="relative mb-3">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 pr-10"
                  placeholder="Confirmar senha"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {/* REGRAS SENHA */}

            {modal === "senha" && (
              <p className="text-xs text-gray-500 mb-3">
                • mínimo 8 caracteres
                <br />
                • letra maiúscula
                <br />
                • número
                <br />• símbolo
              </p>
            )}

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                className="bg-[#8E000C] text-white px-4 py-2 rounded-lg"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO */}

      {confirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Confirmar alteração</h2>

            <p className="text-sm text-gray-600 mb-6">
              Tem certeza que deseja salvar essa alteração?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmModal(false)}
                className="border px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="bg-[#8E000C] text-white px-4 py-2 rounded-lg"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
