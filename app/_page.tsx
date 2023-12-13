"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSession, signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  return (
    <Card className="w-[550px] shadow-2xl">
      <CardHeader>
        <div className="flex justify-center">
          <CardTitle>Sign In</CardTitle>
        </div>
        <div className="flex justify-center">
          <CardDescription>Sign in to access courses.</CardDescription>
        </div>
      </CardHeader>
      <div className="mb-5" />
      <CardContent>
        <div className="flex justify-center">
          <Button onClick={() => signIn("google")}>
            <FcGoogle className="mr-2 h-4 w-4" /> Login with Google
          </Button>
        </div>
      </CardContent>
      <div className="mb-5" />
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input id="email" placeholder="Enter Email" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input id="password" placeholder="Enter Password" />
            </div>
          </div>
          <div className="mt-5">
            <Button>Login</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
