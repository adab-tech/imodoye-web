import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

// Roles allowed into /admin. "fellow" and "public" are site visitors, not editors.
export const ADMIN_ROLES = [
  "super_admin",
  "programme_director",
  "residency_editor",
  "review_editor",
  "section_editor",
  "reviewer",
  "content_editor",
] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const rows = await sql`
          select id, full_name, email, password_hash, role
          from profiles
          where email = ${email.toLowerCase()}
        `;
        const profile = rows[0];
        if (!profile?.password_hash) return null;

        const valid = await bcrypt.compare(password, profile.password_hash);
        if (!valid) return null;
        if (!ADMIN_ROLES.includes(profile.role)) return null;

        return {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          role: profile.role as AdminRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: AdminRole }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { role?: AdminRole }).role = token.role as AdminRole;
      return session;
    },
  },
});

declare module "@auth/core/types" {
  interface User {
    role?: AdminRole;
  }
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role: AdminRole;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: AdminRole;
  }
}
