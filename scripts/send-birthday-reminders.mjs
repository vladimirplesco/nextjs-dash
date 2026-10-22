import fs from "node:fs/promises";
import path from "node:path";
import nodemailer from "nodemailer";
import nextEnv from "@next/env";
import { parse } from "yaml";
// import { loadEnvConfig } from "@next/env";

// nextEnv.loadEnvConfig(process.cwd);
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const PEOPLE_DIR = path.join(process.cwd(), "content", "people");

const SENT_HISTORY_FILE = path.join(
  process.cwd(),
  "content",
  "birthday-reminders-sent.json",
);

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  BIRTHDAY_RECIPIENTS,
} = process.env;

// function getTomorrow() {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   return {
//     day: String(tomorrow.getDate()).padStart(2, "0"),
//     month: String(tomorrow.getMonth() + 1).padStart(2, "0"),
//   }
// }

function getTargetDate() {
  const dateArg = process.argv.find((arg) =>
    arg.startsWith("--date="),
  );

  let targetDate;

  if (dateArg) {
    const dateString =dateArg.slice("--date=".length);
    const match = dateString.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

    if (!match) {
      throw new Error(
        "Неверная дата. Используйте формат ДД.ММ.ГГГГ, например --date=25.12.2026",
      );
    }

    const [, day, month, year] = match;

    targetDate = new Date(
      Number(year),
      Number(month) -1,
      Number(day),
    );

    if (
      targetDate.getFullYear() !== Number(year) ||
      targetDate.getMonth() !== Number(month) - 1 ||
      targetDate.getDate() !== Number(day)
    ) {
      throw new Error("Такой календарной даты не существует.");
    }
  } else {
    targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
  }

  return {
    day: String(targetDate.getDate()).padStart(2, "0"),
    month: String(targetDate.getMonth() + 1).padStart(2,"0"),
    year: String(targetDate.getFullYear()),
  };
}

// добавим возможность тестирования с аргументом --history-file=
// node scripts/send-birthday-reminders.mjs --check-history --history-file=/tmp/birthday-history-test.json --date=07.12.2026
function getHistoryFile() {
  const historyArg = process.argv.find((arg) =>
    arg.startsWith("--history-file="),
  );

  return historyArg
    ? path.resolve(historyArg.slice("--history-file=".length))
    : SENT_HISTORY_FILE;
}

async function readSentHistory() {
  // const historyArg = process.argv.find((arg) =>
  //   arg.startsWith("--history-file="),
  // );

  // const historyFile = historyArg
  //   ? path.resolve(historyArg.slice("--history-file=".length))
  //   : SENT_HISTORY_FILE;
  const historyFile = getHistoryFile();

  try {
    const content = await fs.readFile(
      // SENT_HISTORY_FILE,
      historyFile,
      "utf-8",
    );

    return JSON.parse(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }

    throw error;
  }

}

async function readPeople() {
  const files = await fs.readdir(PEOPLE_DIR);
  const people = [];

  for (const file of files) {
    if (!file.endsWith(".yaml") && !file.endsWith(".yml")) {
      continue;
    }

    const content = await fs.readFile(
      path.join(PEOPLE_DIR, file),
      "utf-8",
    );

    let person;

    try {
      person = parse(content);
    } catch(error) {
      throw new Error(
        `Ошибка в файле ${file}: ${error.message}`,
        { cause: error },
      );
    }

    if (person?.name && typeof person.birthDate === "string") {
      people.push(person);
    }
  }

  return people;
}

async function main() {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("Не все SMTP-переменные настроены.");
  }

  const recipients = (BIRTHDAY_RECIPIENTS || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    throw new Error("Не заданы получатели BIRTHDAY_RECIPIENTS.");
  }

  // const { day, month } = getTomorrow();
  const { day, month, year } = getTargetDate();
  console.log(
    `Проверяем дни рождения на ${day}.${month}.${year}`,
  )

  // Можем запустить тест на выбранную дату, не отправляя письмо например:
  // node scripts/send-birthday-reminders.mjs --dry-run --date=25.12.2026

  const people = await readPeople();

  const birthdays = people.filter((person) => {
    const match = person.birthDate.match(/^(\d{2})\.(\d{2})\.\d{4}$/);

    return match && match[1] === day && match[2] === month;
  });

  if (birthdays.length === 0) {
    console.log(`На ${day}.${month}.${year} дней рождения нет. Письмо не отправлено.`);
    return;
  }

  const birthdayList = birthdays
    .map((person) => `• ${person.name} - ${person.birthDate}`)
    .join("\n");

  if (process.argv.includes("--dry-run")) {
    console.log("Пробный запуск: письмо НЕ отправлено.");
    console.log("Получатели:", recipients);
    console.log(`Тема: Напоминание: дни рождения ${day}.${month}.${year}`);
    console.log(`Дни рождения ${day}.${month}.${year}:\n\n${birthdayList}`);
    return;
  }

  const targetDateKey = `${year}-${month}-${day}`;
  const sentHistory = await readSentHistory();
  const forceSend = process.argv.includes("--force");

  // Проверяем историю без отправки письма.
  // Режим --check-history завершает выполнение до SMTP.
  // node scripts/send-birthday-reminders.mjs --check-history --history-file=/tmp/birthday-history-test.json --date=07.12.2026
  if (process.argv.includes("--check-history")) {
    if (sentHistory[targetDateKey]) {
      console.log(`История: дата ${targetDateKey} уже есть в файле.`);
    } else {
      console.log(`История: записи для ${targetDateKey} нет.`);
    }

    if (sentHistory[targetDateKey] && !forceSend) {
      console.log("Повторная отправка запрещена без --force.");
    } else {
      console.log("Проверка разрешает продолжить отправку.");
    }

    return;
  }

  if (sentHistory[targetDateKey] && !forceSend) {
    console.log(
      `Напоминание на ${targetDateKey} уже отправлялось. Повторная отправка отменена.`
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: SMTP_USER,
    to: recipients,
    // bcc: recipients,
    subject: `Напоминание: дни рождения ${day}.${month}.${year}`,
    text: `Дни рождения ${day}.${month}.${year}:\n\n${birthdayList}`,
  });

  sentHistory[targetDateKey] = {
    sentAt: new Date().toISOString(),
    birthdays: birthdays.map((person) => person.name),
  };

  await fs.writeFile(
      // SENT_HISTORY_FILE,
      getHistoryFile(),
      JSON.stringify(sentHistory, null, 2) + "\n",
      "utf-8",
  )

  console.log(`Письмо отправлено. Количество именинников: ${birthdays.length}.`);

}

main().catch((error)=> {
  console.error("Ошибка выполнения скрипта:", error.message);
  process.exitCode = 1;
});
