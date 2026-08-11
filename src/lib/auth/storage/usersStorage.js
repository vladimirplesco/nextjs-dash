import fs from "fs/promises";
import path from "path";
import { parse, stringify} from "yaml";

// ---------------------------------------------------------------------
// Константы
// ---------------------------------------------------------------------

const USERS_DIR = path.join(
  process.cwd(),
  "content",
  "users"
);

//------------------------------------------

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
 * Проверяет корректность имени пользователя.
 */
export function isValidUsername(username) {
  return /^[a-zA-Z0-9_-]+$/.test(username);
}

/**
 * Сохраняет пользователя в YAML.
 */
export async function saveUser(user) {
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
export async function loadUser(username) {
  if(!isValidUsername(username)) {
    return null;
  }

  const filePath = getUserFilePath(username);
  try {
    const file = await fs.readFile(filePath, "utf8");
    return parse(file);
  } catch {
    return null;
  }
}

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

    const username = path.parse(file).name;

    const user = await loadUser(username);

    if (!user) {
      continue;
    }

    users.push(user);
  }

  return users;
}
/**
 * Удаляет пользователя.
 */
export async function deleteUser(username) {

  const filePath = getUserFilePath(username);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

  }

}