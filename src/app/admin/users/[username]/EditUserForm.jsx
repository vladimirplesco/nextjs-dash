"use client";
import { useActionState } from "react";
import { saveUserAction } from "./actions";
// import { USER_ROLES } from "@/lib/auth/constants";
import { USER_ROLES_OPTIONS } from "@/lib/auth/constants";

export default function EditUserForm({
  user,
}) {
  const action = saveUserAction.bind(null, user.username);
  const [
    state,
    formAction,
    isPending
  ] = useActionState(
    action,
    {
      errors: {},
      values: {
        name: user.name,
        role: user.role,
        active: user.active,
      },
      success: false,
    }
  )

  return (

    <form action={formAction}>
      {state.errors.general && (
        <div className="alert alert-error mb-4">
          {state.errors.general}
        </div>
      )}
      <table className="table">
        <tbody>
          <tr>
            <th>Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th>Имя</th>
            <td><input
              name="name"
              className="input input-bordered w-full"
              defaultValue={state.values.name} />

              {state.errors.name && (
                <div className="text-error mt-1">
                  {state.errors.name}
                </div>
              )}
            </td>
          </tr>
          <tr>
            <th>Роль</th>
            <td>
              {user.role === "superadmin" ? (
                <>
                <input
                  className="input input-bordered w-full"
                  value="superadmin"
                  disabled
                />

                {/* чтобы сервер получил значение */}
                <input
                  type="hidden"
                  name="role"
                  value="superadmin"
                />
              </>
            ) : (
              <select
                name="role"
                defaultValue={state.values.role}
                className="select select-bordered w-full">

                {/* {Object.values(USER_ROLES).map((role) => ( */}
                {USER_ROLES_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            )}
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
                name="active"
                type="checkbox"
                defaultChecked={state.values.active}
                className="checkbox"
              />
            </td>
            </tr>
        </tbody>
      </table>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={isPending}
      >
        {isPending ? "Сохранение..." : "Сохранить"}
      </button>
  </form>
  );

}