"use client";
import { changePasswordAction } from "./password-action";
import { useActionState } from "react";

export default function PasswordChangeForm({
  username,
}) {
  const action = changePasswordAction.bind(null, username);
  const [state, formAction, isPending] = useActionState(
    action,
    {
      errors:{},
      success: false
    }
  )
  return (
  <form action={formAction}>
    {state.success && (
      <div className="alert alert-success mb-4">
        Пароль успешно изменён
      </div>
    )}

    {state.errors.general && (
      <div className="alert alert-error mb-4">
        ❌ {state.errors.general}
      </div>
    )}

    <table className="table">
      <tbody>
        <tr>
          <th>Новый пароль</th>
          <td>
            <input
              name="password"
              type="password"
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
          <th>
            Подтверждение пароля
          </th>
          <td>
            <input
              name="passwordConfirm"
              type="password"
              className="input input-bordered w-full"
            />
            {state.errors.passwordConfirm && (
              <div className="text-error mt-1">
                {state.errors.passwordConfirm}
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>

    <button
          type="submit"
          className="btn btn-primary"
          disabled={isPending}
        >
          {isPending
            ? "Изменение..."
            :"Изменить пароль"
          }
        </button>
  </form>

  );
}