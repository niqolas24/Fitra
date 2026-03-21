import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const providers = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

providers.push(
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email ?? "").trim();
      const password = String(credentials?.password ?? "");
      if (!email || !password) return null;

      const allowedEmail = process.env.AUTH_EMAIL;
      const hash = process.env.AUTH_PASSWORD_HASH;
      if (!allowedEmail || !hash) {
        return null;
      }
      if (email.toLowerCase() !== allowedEmail.toLowerCase()) {
        return null;
      }
      const { default: bcrypt } = await import("bcryptjs");
      const valid = await bcrypt.compare(password, hash);
      if (!valid) return null;

      return {
        id: email,
        email,
        name: email.split("@")[0]?.replace(/[._]/g, " ") ?? "Student",
      };
    },
  }),
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? token.sub ?? "";
      }
      return session;
    },
  },
});
