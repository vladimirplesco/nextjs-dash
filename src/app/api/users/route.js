import { NextResponse } from "next/server";
import { getUsers, createUser } from "@/lib/auth/users";

export async function GET() {
  const users = await getUsers();

  return NextResponse.json(users);
}

export async function POST(request) {
  try {
    const data = await request.json();
    const user = await createUser(data);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
}