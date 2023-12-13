import { db } from "@/lib/db";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const data: any = await getServerSession(authOptions);
    const userId = data?.user?.id;
    const role = data?.user?.role;
    const body = await req.json();

    console.log("body", body);

    if (!userId || role !== "super-admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const Reg: any = await db.user.findFirst({
      where: {
        email: body.email,
      },
    });
    if (Reg) {
      return new NextResponse("User Already exists");
    }
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await db.user.create({
      data: { ...body, password: hashedPassword },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[Users]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
