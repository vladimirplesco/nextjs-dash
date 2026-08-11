import { parse, stringify } from "yaml";

const GITHUB_OWNER = "vladimirplesco";
const GITHUB_REPO = "nextjs-dash";

export async function getGithubFile(username) {
  const filePath = `content/users/${username}.yaml`;

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  // Если файла нет, возвращаем null.
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Github API error: ${response.status}`
    );
  }

  const data = await response.json();

  return {
    ...data,
    url,
  };
}

export async function getUserFromGithub(username) {

  const data = await getGithubFile(username);
  if (data === null) {
    return null;
  }

  const yamlText = Buffer
    .from(data.content, "base64")
    .toString("utf8");

  return parse(yamlText);

}

export async function getUsersFromGithub() {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/users`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    throw new Error(`Github API error: ${response.status}`);
  }

  const files = await response.json();

  const users = [];

  for (const file of files) {
    if (!file.name.endsWith(".yaml")) {
      continue;
    }

    const username = file.name.replace(".yaml", "");
    const user = await getUserFromGithub(username);

    if (!user) {
      continue;
    }

    users.push(user);
  }

  return users;

}
export async function saveUserToGithub(user) {
  const data = await getGithubFile(user.username);

  let sha;
  let url;

  if (data === null) {
    // файла нет
    console.log("MODE: CREATE");
    url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/content/users/${user.username}.yaml`;
  } else {
    // файл существует
    console.log("MODE: UPDATE");

    sha = data?.sha;
    url = data?.url;
  }

  const yamlText = stringify(user);

  const content = Buffer
    .from(yamlText, "utf8")
    .toString("base64");

  let body = {
    message: data === null
    ? `Create user ${user.username}`
    : `Update user ${user.username}`,
    content,
  }

  if (data !== null) {
    body.sha = sha;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  console.log("Github PUT status:",response.status);

  if (!response.ok) {
    throw new Error(
      `Github API error: ${response.status}`
    );
  }

  return await response.json();

}

export async function deleteUserFromGithub(username) {
  const data = await getGithubFile(username);

  let sha;
  let url;

  if (data === null) {
    // файла нет
    return;
  } else {
    // файл существует
    sha = data?.sha;
    url = data?.url;
  }

  const response = await fetch(url, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },

    body: JSON.stringify({
      message: `Delete user ${username}`,
      sha,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Github DELETE error: ${response.status}`
    );
  }

}