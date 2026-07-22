import { NextResponse } from "next/server";
import { changePassword } from "@/lib/auth/users";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    await changePassword(username, password);

    return NextResponse.json({
      sussess: true,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 400,
      }
    );

  }
}