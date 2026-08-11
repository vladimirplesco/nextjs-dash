import bcrypt from "bcryptjs";
import { USER_ROLES} from "./constants";
import { canCreateRole } from "@/lib/auth/permissions";
import { canUpdateUser } from "@/lib/auth/permissions";
import { canDeleteUser } from "@/lib/auth/permissions";
import {
  saveUser,
  loadUser,
  deleteUser as deleteUserFromStorage,
  getUsers as getUsersFromStorage,
  isValidUsername,
} from "./storage/usersStorage";
import {
  getUserFromGithub,
  getUsersFromGithub,
  saveUserToGithub,
  deleteUserFromGithub,
} from "./storage/githubUsersStorage";

const USE_GITHUB_USERS = true;

// ---------------------------------------------------------------------
// Внутренние функции
// ---------------------------------------------------------------------
async function saveUserToStorage(user) {
  if (USE_GITHUB_USERS) {
    return await saveUserToGithub(user);
  }

  return await saveUser(user);
}

async function deleteUserFromSelectedStorage(username) {
  if (USE_GITHUB_USERS) {
    return await deleteUserFromGithub(username);
  }

  return await deleteUserFromStorage(username);
}

/**
 * Хеширует пароль.
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}
/**
 * Сравнивает пароль с хешем.
 */
async function checkPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}


/**
 * Возвращает существующего пользователя по username.
 */
async function loadExistingUser(username) {
  const user = await getUser(username);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
/**
 * Возвращает публичные данные пользователя
 * (без passwordHash).
 */
function toPublicUser(user) {
  return {
    username: user.username,
    name: user.name,
    role: user.role,
    active: user.active,
  }
}

// ---------------------------------------------------------------------
// Публичный API
// ---------------------------------------------------------------------

/**
 * Возвращает пользователя для экспорта.
 */
export async function getUser(username) {
  if (USE_GITHUB_USERS) {
    const user = await getUserFromGithub(username);
    console.log("USER FROM GITHUB:", user)
    return user;
  }
  return loadUser(username);
}

/**
 * Возвращает список всех пользователей.
 */
export async function getUsers() {
  const users = USE_GITHUB_USERS
    ? await getUsersFromGithub()
    : await getUsersFromStorage();

  return users
    .map(toPublicUser)
    .sort((a, b) =>
      a.username.localeCompare(b.username)
    );
}
/**
 * Создаёт нового пользователя.
 */
export async function createUser(
  actor,
  {
  username,
  name,
  password,
  role = "viewer",
  active = true,
}) {

  if (!canCreateRole(actor, role)) {
    throw new Error(
      "Недостаточно прав для создания такой роли"
    );
  }

  username = username.trim().toLowerCase();
  if (!isValidUsername(username)) {
    throw new Error("Invalid username");
  }

  name = name.trim();
  if (!name) {
    throw new Error("Name is required");
  }

  if (!Object.values(USER_ROLES).includes(role)) {
    throw new Error("Invalid role");
  }

  const existingUser = await getUser(username);

  if (existingUser) {
    throw new Error("Пользователь с таким username уже существует");
  }

  const passwordHash = await hashPassword(password);
  const user = {
    username,
    name,
    passwordHash,
    role,
    active,
  };

  await saveUserToStorage(user);
  return toPublicUser(user);
}
/**
 * Обновляет данные пользователя.
 */
export async function updateUser(
  actor,
  username,
  updates
) {

  const user = await loadExistingUser(username);

  if (!canUpdateUser(actor, user, updates)) {
    throw new Error(
      "Недостаточно прав для изменения пользователя"
    );
  }

  if (
    updates.name !== undefined
  ) {
    const name = updates.name;
    if (!name) {
      throw new Error("Name is required");
    }

    user.name = name;
  }

  if (
    updates.role !== undefined &&
    !Object.values(USER_ROLES).includes(updates.role)
  ) {
    throw new Error("Invalid role");
  }

  if (
    updates.role !== undefined
  ) {
    user.role = updates.role;
  }

  if (
    updates.active !== undefined
  ) {
    user.active = updates.active;
  }

  // await saveUser(user);
  await saveUserToStorage(user);

  return toPublicUser(user);

}
/**
 * Проверяет пароль пользователя.
 */
export async function verifyPassword(username, password) {
  const user = await loadUser(username);
  if (!user) {
    return null;
  }

  if (!user.active) {
    return null;
  }
  // const ok = await bcrypt.compare(password, user.passwordHash);
  const ok = await checkPassword(
    password,
    user.passwordHash
  );
  return ok ? toPublicUser(user) : null;

}
/**
 * Меняет пароль пользователя.
 */
export async function changePassword(username, newPassword) {

  const user = await loadExistingUser(username);

  if (!newPassword || newPassword.length < 6) {
    throw new Error("Invalid password");
  }

  user.passwordHash = await hashPassword(newPassword);

  await saveUser(user);

  return toPublicUser(user);

}
/**
 * Удаляет пользователя.
//  */
export async function deleteUser(actor, username) {

  const user = await loadExistingUser(username);

  if (!canDeleteUser(actor, user)) {
    throw new Error(
      "Недостаточно прав для удаления пользователя"
    );
  }

  await deleteUserFromSelectedStorage(username);

}