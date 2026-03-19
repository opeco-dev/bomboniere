'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../public/opeco-logo.png';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // #region agent log
    fetch('http://127.0.0.1:7887/ingest/83098060-f6a0-4f83-b310-6ca8f094a830', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '3b194b',
      },
      body: JSON.stringify({
        sessionId: '3b194b',
        runId: 'pre-fix',
        hypothesisId: 'H1',
        location: 'app/login/page.js:28',
        message: 'login_submit_attempt',
        data: { emailLength: form.email.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.ok) {
      // #region agent log
      fetch('http://127.0.0.1:7887/ingest/83098060-f6a0-4f83-b310-6ca8f094a830', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Debug-Session-Id': '3b194b',
        },
        body: JSON.stringify({
          sessionId: '3b194b',
          runId: 'pre-fix',
          hypothesisId: 'H2',
          location: 'app/login/page.js:46',
          message: 'login_success',
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion agent log
      router.replace('/dashboard');
    } else {
      router.replace('/login?error=CredentialsSignin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4">

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-6">
           <Image src={logo} width={120} height={120} alt='logo-opeco'/>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-gray-900">
              Seja Bem Vindo!
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              Insira as informações abaixo para que você venha entrar em sua conta
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-[#8E000C] text-center">
              Email ou senha inválidos
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-xs text-gray-500">Email</label>

              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="email@gmail.com"
                className="w-full mt-1 px-3 py-2 text-sm border-2 border-[#8E000C] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="text-xs text-gray-500">Senha</label>

              <div className="relative mt-1">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full px-3 py-2 text-sm border-2 border-[#8E000C] rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400"
                >
                  {showPassword ? <EyeOff color="#8E000C" size={18} /> : <Eye color="#8E000C" size={18} />}
                </button>
              </div>
            </div>

            {/* Esqueci senha */}
            <div className="text-xs text-gray-400">
              Esqueci minha senha
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8E000C] hover:bg-red-800 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {/* divisor */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex-1 h-px bg-gray-200"></div>
              ou
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

          </form>
        </div>

        {/* Voltar */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            ← Voltar para página inicial
          </Link>
        </div>

      </div>
    </div>
  );
}