import NextAuth, { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import axios from "axios";

import { AdapterUser } from "@auth/core/adapters";

interface CustomUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface CustomSessionUser {
  id: string;
  email: string;
  name?: string;
  token: string;
}

export const authConfig = {
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  signOut: "/admin/login"
  },
  callbacks: {
    signIn() {
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },

    authorized({}) {
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.email = customUser.email;
        token.name = customUser.name;
        token.token = customUser.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        token: token.token as string,
        email: token.email as string,
        name: token.name as string,
      } as CustomSessionUser & AdapterUser;

      return session;
    },
  },
  events: {},

  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });
          console.log("Login payload:", { email: credentials?.email, password: credentials?.password });

          console.log("API Response:", response.data);

          const data = response.data;

          if (response.status === 200) {
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.name,
              token: data.token,
            } as CustomUser;
          } else {
            return null;
          }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
              console.error("Login error:", error.response?.data || error.message);
            } else {
              console.error("Unexpected error:", error);
            }
            return null;
          }
        },
      }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth(authConfig);
