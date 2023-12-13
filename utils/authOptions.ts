import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  //   adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        // console.log("credentials", credentials);
        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          throw new Error("Please enter a valid email address!");
        }
        // if (user.blocked) {
        //   throw new Error("User has been blocked");
        // }
        if (!user?.password) {
          throw new Error("Password not created");
        }

        const isCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isCorrect) {
          throw new Error("Incorrect password");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      const userSession = await db.user.findUnique({
        where: {
          email: session.user?.email!,
        },
      });

      if (session) {
        session.user.id = userSession?.id;
        session.user.name = userSession?.name;
        session.user.email = userSession?.email;
        session.user.role = userSession?.role;
      }

      return session;
    },
    // async signIn({ profile }) {
    //   console.log("profile", profile);
    //   try {
    //     const userExists = await db.user.findUnique({
    //       where: {
    //         email: profile?.email,
    //       },
    //     });

    //     if (!userExists) {
    //       await db.user.create({
    //         data: {
    //           email: profile?.email!,
    //           name: profile?.name,
    //           role: "user",
    //           image: profile?.image,
    //         },
    //       });
    //     }

    //     return true;
    //   } catch (error) {
    //     console.log("error", error);
    //     return false;
    //   }
    // },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.email) {
        await db.user.create({
          data: {
            email: token?.email!,
            name: token?.name,
            role: "user",
            //   image: token?.image,
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
      };
    },
    // redirect() {
    //   return "/search";
    // },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
