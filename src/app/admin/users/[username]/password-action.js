"use server";

import { changePassword } from "@/lib/auth/users";

export async function changePasswordAction(
  username,
  prevState,
  formData
) {
  const password = formData.get("password")?.trim();
  const passwordConfirm = formData.get("passwordConfirm")?.trim();

  if (!password) {
    return {
      errors: {
        password: "Введите пароль",
      },
      success: false,
    };
  }

  if (password.length < 6) {
    return {
      errors: {
        password: "Пароль должен быть минимум 6 символов",
      },
      success: false,
    };
  }

  if (password !== passwordConfirm) {
    return {
      errors: {
        passwordConfirm: "Пароли не совпадают",
      },
      success: false,
    }
  }
  try {
    await changePassword(
      username,
      password
    );
  } catch (error) {
    console.error(error);

    return {
      errors: {
        general: "Ошибка смены пароля",
      },
      success: false,
    }
  }

  return {
    errors: {},
    success: true,
  }
}