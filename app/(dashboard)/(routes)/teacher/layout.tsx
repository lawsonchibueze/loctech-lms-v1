"use client";
import { auth } from "@clerk/nextjs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  // const { userId } = auth();
  const { data: session }: any = useSession();

  const role = session?.user?.role;

  if (role !== "admin") {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
