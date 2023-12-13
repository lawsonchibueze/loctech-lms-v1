"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";

const Account = () => {
  const { data }: any = useSession();
  const userId = data?.user?.id;

  if (!userId) {
    return redirect("/");
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("admin");
  const [password, setPassword] = useState<string>("");

  const router = useRouter();

  if (data?.user?.role !== "super-admin") router.back();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const cred = { email, password, name };
    // console.log("cred", cred);
    if (!email || !password) {
      //  toast({
      //    variant: "destructive",
      //    description: "Cant submit empty fields",
      //  });
      // console.log("error email");
      toast.error("please fill all input to continue");
    }
    try {
      await axios.post("/api/register", { name, email, password, role });
      toast.success("Teacher registered sucessfully");
      setIsLoading(false);
    } catch (error) {
      toast.error("Error occured, please try again later");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="w-full h-full flex justify-center items-center">
        <Card className="w-[550px] shadow-2xl">
          <CardHeader>
            <div className="flex justify-center">
              <CardTitle>Create Account</CardTitle>
            </div>
            <div className="flex justify-center">
              <CardDescription>Create account for teachers</CardDescription>
            </div>
          </CardHeader>
          <CardContent></CardContent>
          <div className="mb-5" />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex justify-center w-full">
                <div className="grid items-center lg:gap-8 gap-4 sm:gap-1 w-full">
                  <div className="flex flex-col space-y-1.5">
                    <Input
                      id="name"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Full Name"
                      type="text"
                    />
                  </div>
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
                  <div className="flex flex-col space-y-1.5">
                    <Select onValueChange={(e) => setRole(e)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">admin</SelectItem>
                        <SelectItem value="super-admin">super-admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                {!isLoading ? (
                  <Button type="submit" className="w-full">
                    Register
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
    </div>
  );
};
export default Account;
