import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import SessionProviderWrapper from './components/SessionProviderWrapper';
import { CartProvider } from './components/contexts/CartContext'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bomboniere Orlando - Sistema de Gestão',
  description: 'Sistema de gestão de estoque e vendas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <CartProvider>

            {children}

          </CartProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

