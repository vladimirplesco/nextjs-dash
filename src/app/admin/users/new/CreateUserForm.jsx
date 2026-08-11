"use client";

import { useActionState } from "react";
import { createUserAction } from "./actions";
// import { USER_ROLES } from "@/lib/auth/constants";
import { USER_ROLES_OPTIONS } from "@/lib/auth/constants";

export default function CreateUserForm() {
  const [
    state,
    formAction,
    isPending
  ] = useActionState(
    createUserAction,
    {
      errors: {},
      values: {
        username: "",
        name: "",
        role: "viewer",
        active: false,
      },
      success: false
    }
  );

  return (
    <form
      action={formAction}
      autoComplete="off"
    >

      {state.errors.general && (
        <div className="alert alert-error mb-4">
          ❌ {state.errors.general}
        </div>
      )}

      <table className="table">
        <tbody>
          <tr>
            <th>Username</th>
            <td>
              <input
                name="username"
                autoComplete="new-password"
                defaultValue={state.values?.username}
                className="input input-bordered w-full"
              />

              {state.errors.username && (
                <div className="text-error mt-1">
                  {state.errors.username}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <th>Имя</th>
            <td>
              <input
                name="name"
                defaultValue={state.values?.name}
                className="input input-bordered w-full"
              />

              {state.errors.name && (
                <div className="text-error mt-1">
                  {state.errors.name}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <th>Пароль</th>
            <td>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                className="input input-bordered w-full"
              />

              {state.errors.password && (
                <div className="text-error mt-1">
                  {state.errors.password}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <th>Подтверждение пароля</th>
            <td>
              <input
                name="passwordConfirm"
                type="password"
                autoComplete="new-password"
                className="input input-bordered w-full"
              />
              {state.errors.passwordConfirm && (
                <div className="text-error mt-1">
                  {state.errors.passwordConfirm}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <th>Роль</th>
            <td>
              <select
                name="role"
                className="select select-bordered w-full"
                defaultValue={state.values?.role}
              >
                {/* {Object.values(USER_ROLES).map((role) => ( */}
                {USER_ROLES_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>

              {state.errors.role && (
                <div className="text-error mt-1">
                  {state.errors.role}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <th>Активен</th>
            <td>
              <input
                type="checkbox"
                name="active"
                className="checkbox"
                defaultChecked={state.values?.active}
              />
            </td>
          </tr>
        </tbody>

      </table>
      <button
        className="btn btn-primary"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Создание..." : "Создать"}
      </button>

    </form>
  );

}