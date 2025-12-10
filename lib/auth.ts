import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = (credentials.email as string).toLowerCase();
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!isValidPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatarUrl,
          };
        } catch (error) {
          console.error("[AUTH] Error during authorization:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        
        // İlk giriş veya token yenileme: workspace ve role bilgisini al
        const membership = await prisma.workspaceMember.findFirst({
          where: { userId: user.id },
          orderBy: { workspace: { createdAt: "desc" } },
        });
        
        token.workspaceId = membership?.workspaceId ?? null;
        token.role = membership?.role ?? null;
      }
      
      // Session update tetiklendiğinde (workspace değişikliği)
      if (trigger === "update" && token.id) {
        const membership = await prisma.workspaceMember.findFirst({
          where: { userId: token.id as string },
          orderBy: { workspace: { createdAt: "desc" } },
        });
        
        token.workspaceId = membership?.workspaceId ?? null;
        token.role = membership?.role ?? null;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.workspaceId = token.workspaceId as string | null;
        session.user.role = token.role as any;
      }
      return session;
    },
  },
});

