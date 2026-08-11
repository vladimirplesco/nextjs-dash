"use server"

import { redirect } from "next/navigation";
import {createUser} from "@/lib/auth/users";
import { USER_ROLES } from "@/lib/auth/constants";
import { auth } from "@/auth";
import { canCreateRole } from "@/lib/auth/permissions";

export async function createUserAction(_prevStation, formData) {
  const session = await auth();

  if(!session) {
    throw new Error("Unathorized");
  }

  const actor = session.user;

  const data = {
    username: formData.get("username"),
    name: formData.get("name")?.trim(),
    password: formData.get("password")?.trim(),
    passwordConfirm: formData.get("passwordConfirm")?.trim(),
    role: formData.get("role"),
    active: formData.has("active"),
  }

  if (!canCreateRole(actor, data.role)) {
    return {
      errors: {
        role: "Недостаточно прав для создания такой роли",
      },
      values: {
        username: data.username,
        name: data.name,
        role: data.role,
        active: data.active,
      },
      success:false,
    };
  }

  const errors = {};

  if (!data.username) {
    errors.username = "Введите username";
  }

  if (!data.name) {
    errors.name = "Введите имя";
  }

  if (!data.password) {
    errors.password = "Введите пароль";
  } else if (data.password.length < 6) {
    errors.password = "Пароль должен быть минимум 6 символов";
  }

  if (data.password !== data.passwordConfirm) {
    errors.passwordConfirm = "Пароли не совпадают";
  }

  if (!Object.values(USER_ROLES).includes(data.role)) {
    errors.role = "Недопустимая роль";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
       values: {
        username: data.username,
        name: data.name,
        role: data.role,
        active: data.active,
      },
      success: false,
    };
  }

  try {
    await createUser(actor, data);
  } catch (error) {
    console.error(error)
    return {
      errors: {
        username: error.message || "Такой пользователь уже существует",
      },
      values: {
        username: data.username,
        name: data.name,
        role: data.role,
        active: data.active,
      },
      success: false,
    };
  }

  redirect("/admin/users");

}