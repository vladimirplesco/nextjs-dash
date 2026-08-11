"use server";
import { updateUser } from "@/lib/auth/users";
import { redirect } from "next/navigation";
import { USER_ROLES} from "@/lib/auth/constants";
import { auth }  from "@/auth";

export async function saveUserAction(username, prevState, formData) {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const actor = session.user;

  const data = {
    name: formData.get("name")?.trim(),
    role: formData.get("role"),
    active: formData.has("active"),
  };

  const errors = {};

  if (!data.name) {
    errors.name = "Введите имя";
  }

  if (!Object.values(USER_ROLES).includes(data.role)) {
    errors.role = "Недопустимая роль";
  }


  if (Object.keys(errors).length > 0) {
    return {
      errors,
      values: {
        name: data.name,
        role: data.role,
        active: data.active,
      },
      success: false,
    };
  }

  try {
    await updateUser(actor, username, data);
  } catch (error) {

    console.error(error);
    return {
      errors: {
        general: error.message || "Ошибка сохранения",
      },
      values: {
        name: data.name,
        role: data.role,
        active: data.active,
      },
      success: false,
    };

  }
  redirect(`/admin/users/${username}`);

}