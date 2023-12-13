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
import { GithubIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  const { data: session }: any = useSession();

  if (session?.user) router.push("/search");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cred = { email, password };
    // console.log("cred", cred);
    if (!email || !password) {
      //  toast({
      //    variant: "destructive",
      //    description: "Cant submit empty fields",
      //  });
      // console.log("error email");
      toast.error("please fill all input to continue");
    }
    signIn("credentials", {
      ...cred,
      redirect: false,
    }).then((callback) => {
      // console.log(callback);
      if (!callback?.error) {
        toast.success("login successful");
        //  router.refresh();
        setTimeout(() => {
          setIsLoading(false);
          // router.push("/search");
        }, 1000);
      }
      if (callback?.error) {
        toast.error(callback?.error);
        setIsLoading(false);
        // console.log("callback", callback?.error);
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
            <div className="gap-5 grid grid-rows-2 grid-flow-col lg:flex lg:justify-center lg:grid-cols-2 sm:grid-cols-1 w-full">
              <Button
                variant="outline"
                className="text-base h-auto"
                onClick={() => signIn("google")}
              >
                <FcGoogle className="mr-2 h-6 w-6" /> Login with Google
              </Button>
              <Button
                variant="secondary"
                className="text-base h-auto"
                onClick={() => signIn("github")}
              >
                <GithubIcon className="mr-2 h-6 w-6" /> Login with Github
              </Button>
            </div>
          </div>
        </CardContent>
        <div className="mb-5" />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center w-full">
              <div className="grid items-center lg:gap-2 gap-4 sm:gap-1 w-full">
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    type="email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    type="password"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              {!isLoading ? (
                <Button type="submit" className="w-full">
                  Login
                </Button>
              ) : (
                <Button disabled className="w-full flex justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
