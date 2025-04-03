import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../../../prisma/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
  interface JWT {
    isConfigured?: boolean
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn({ 
      profile }) {
      if (!profile?.email) {
        throw new Error("No profile email available");
      }

      await prisma.user.upsert({
        where: { email: profile.email },
        create: {
          email: profile.email,
          name: profile.name || profile.email.split('@')[0],
        },
        update: {
          name: profile.name || profile.email.split('@')[0],
        }
      });

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (!token.isConfigured) {
        const savedUser = await prisma.user.findFirst({ where: { email: user!.email as string } })
        token.sub = savedUser!.id
        token.isConfigured = true
      }
      return token;
    }
  },
};

const handler = NextAuth(authOptions as NextAuthOptions);
export { handler as GET, handler as POST };
