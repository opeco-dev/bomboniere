import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET ausente na Vercel");
}

if (!process.env.NEXTAUTH_URL) {
  throw new Error("NEXTAUTH_URL ausente na Vercel");
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL ausente na Vercel");
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.usuario.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.ativo) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.senha,
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: user.id,
            name: user.nome,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error("ERRO_AUTHORIZE_NEXTAUTH:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        session.user = {};
      }

      session.user.id = token.id;
      session.user.role = token.role || "user";

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
