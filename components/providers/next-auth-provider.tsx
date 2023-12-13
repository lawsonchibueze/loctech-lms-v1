"use client";
import { SessionProvider } from "next-auth/react";

interface provider {
  children: React.ReactNode;
  session?: any;
}

const Provider = ({ children, session }: provider) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;
