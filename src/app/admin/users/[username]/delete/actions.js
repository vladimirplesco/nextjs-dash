"use server";
import { auth } from "@/auth";
import { deleteUser } from "@/lib/auth/users";
import { redirect } from "next/navigation";

export async function deleteUserAction(username) {
  // console.log("deleteUserActions");

  const session = await auth();

  if (!session) {
    throw new Error("Вы не авторизованы");
  }

  const actor = session.user;

  await deleteUser(actor, username);

  redirect("/admin/users");
}