"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Неверный логин или пароль");
      return;
    }

    window.location.href = "/keystatic"
  }

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-4">
            Вход в панель управления
          </h1>

          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <label className="label">Логин</label>

              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />

              <label className="label mt-3">Пароль</label>

              <input
                type="password"
                className="input input-bordered w-full"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              {error && (
                <div className="alert alert-error mt-4">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full mt-6"
              >
                Войти
              </button>

            </fieldset>

          </form>

        </div>

      </div>

    </div>
  )
}