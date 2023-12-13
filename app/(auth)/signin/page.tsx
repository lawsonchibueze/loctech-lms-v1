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
import { SignIn } from "@clerk/nextjs";
import { Label } from "recharts";
import { useSession, signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cred = { email, password };
    if (!email || !password) {
      //  toast({
      //    variant: "destructive",
      //    description: "Cant submit empty fields",
      //  });
      console.log("error email");
    }
    setIsLoading(true);
    signIn("credentials", {
      ...cred,
      redirect: false,
    }).then((callback) => {
      // console.log(callback);
      if (!callback?.error) {
        //  router.refresh();
        //  toast({
        //    variant: "success",
        //    description: "Login successfull",
        //  });
        //  setTimeout(() => {
        //    setIsLoading(false);
        //    router.push("/redirect");
        //  }, 1000);
        console.log("Login Successful");
      }
      if (callback?.error) {
        //  toast({
        //    description: `${callback?.error}`,
        //    variant: "destructive",
        //  });
        //  setIsLoading(false);
        console.log("callback", callback?.error);
      }
    });
  };
  return (
    <div className="w-full h-full flex justify-center items-center">
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
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                />
              </div>
            </div>
            <div className="mt-5">
              <Button type="submit">Login</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
