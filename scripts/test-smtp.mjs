import nodemailer from "nodemailer";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
  console.error("Ошибка: не все SMTP-переменные заданы в .env.local");
  process.exit(1);
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

try {
  await transporter.verify();
  console.log("Успех: подключение к SMTP-серверу подтверждено.");
} catch (error) {
  console.error("Не удалось подключиться к SMTP.");
  console.error("Код ошибки:", error.code || "не указан");
  console.error("Ответ сервера:", error.responseCode || "не указан");
  console.error("Проверь настройки Gmail и пароль приложения.");
  process.exitCode = 1;
}