import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
// import { parse } from "yaml";
import { parse, stringify} from "yaml";

// ---------------------------------------------------------------------
// Константы
// ---------------------------------------------------------------------
const USERS_DIR = path.join(process.cwd(), "content", "users");

// ---------------------------------------------------------------------
// Внутренние функции
// ---------------------------------------------------------------------

/**
 * Проверяет корректность имени пользователя.
 */
function isValidUsername(username) {
  return /^[a-zA-Z0-9_-]+$/.test(username);
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
 * Полный путь к файлу по имени пользователя
 */
function getUserFilePath(username) {
  if (!username) {
    throw new Error("Username is required");
  }
  return path.join(
    USERS_DIR,
    `${username}.yaml`
  );
}
/**
 * Сохраняет пользователя в YAML.
 */
async function saveUser(user) {
  const filePath = getUserFilePath(user.username);

  await fs.writeFile(
    filePath,
    stringify(user),
    "utf8"
  );
}
/**
 * Возвращает пользователя по username.
 */
// export async function getUser(username) {
async function loadUser(username) {
  if(!isValidUsername(username)) {
    return null;
  }

  // const filePath = path.join(USERS_DIR, `${username}.yaml`);
  const filePath = getUserFilePath(username);
  try {
    const file = await fs.readFile(filePath, "utf8");
    return parse(file);
  } catch {
    return null;
  }
}
/**
 * Возвращает существующего пользователя по username.
 */
async function loadExistingUser(username) {
  const user = await loadUser(username);

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
 * Возвращает список всех пользователей.
 */
export async function getUsers() {
  const files = await fs.readdir(USERS_DIR);

  const users = [];

  for (const file of files) {
    if (!file.endsWith(".yaml")) {
      continue;
    }

    // const username = file.replace(".yaml", "");
    const username = path.parse(file).name;

    const user = await loadUser(username);

    if (!user) {
      continue;
    }

    // users.push({
    //   username: user.username,
    //   name: user.name,
    //   role: user.role,
    //   active: user.active,
    // });
    users.push(toPublicUse(user));
  }

  // return users;
  return users.sort((a,b) =>
    a.username.localeCompare(b.username)
  );
}
/**
 * Создаёт нового пользователя.
 */
export async function createUser({
  username,
  name,
  password,
  role = "viewer",
  active = true,
}) {
  if (!isValidUsername(username)) {
    throw new Error("Invalid username");
  }

  const existingUser = await loadUser(username);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // const passwordHash = await bcrypt.hash(password, 12);
  const passwordHash = await hashPassword(password);
  const user = {
    username,
    name,
    passwordHash,
    role,
    active,
  };

  // const filePath = path.join(
  //   USERS_DIR,
  //   `${username}.yaml`
  // );
  // const filePath = getUserFilePath(username);

  // await fs.writeFile(
  //   filePath,
  //   stringify(user),
  //   "utf8"
  // );

  await saveUser(user);

  // return user;
  return toPublicUser(user);
}
/**
 * Обновляет данные пользователя.
 */
export async function updateUser(username, updates) {
  // const user = await loadUser(username);

  // if (!user) {
  //   throw new Error('User not found');
  // }

  const user = await loadExistingUser(username);

  if (
    updates.name != undefined
  ) {
    user.name = updates.name;
  }

  if (
    updates.role != undefined
  ) {
    user.role = updates.role;
  }

  if (
    updates.active != undefined
  ) {
    user.active = updates.active;
  }

  // const filePath = getUserFilePath(username);

  // await fs.writeFile(
  //   filePath,
  //   stringify(user),
  //   "utf8"
  // )

  await saveUser(user);

  // return {
  //   username: user.username,
  //   name: user.name,
  //   role: user.role,
  //   active: user.active,
  // }
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
  return ok ? user : null;

}
/**
 * Меняет пароль пользователя.
 */
export async function changePassword(username, newPassword) {
  // const user = await loadUser(username);

  // if (!user) {
  //   throw new Error("User not found");
  // }

  const user = await loadExistingUser(username);

  // user.passwordHash = await bcript.hash(newPassword, 12);
  user.passwordHash = await hashPassword(newPassword);
  // const filePath = path.join(
  //   USERS_DIR,
  //   `${username}.yaml`
  // );
  // const filePath = getUserFilePath(username);

  // await fs.writeFile(
  //   filePath,
  //   stringify(user),
  //   "utf8"
  // );

  await saveUser(user);

  // return {
  //   username: user.username,
  //   name: user.name,
  //   role: user.role,
  //   active: user.active,
  // }
  return toPublicUser(user);

}