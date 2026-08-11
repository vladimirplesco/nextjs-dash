import { getUser } from "@/lib/auth/users";
import { auth } from "@/auth";
import { canDeleteUser } from "@/lib/auth/permissions";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { deleteUserAction } from "./actions";

export default async function DeleteUserPage({params,}) {

  const session = await auth();

  if(!session) {
    redirect("/login");
  }

  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  const actor = session.user;

  const editUrl = `/admin/users/${user.username}`;

  if (!canDeleteUser(actor, user)) {
    return (
      <div className="max-w-xl">
        <div className="alert alert-error">
          <span>
            У вас недостаточно прав для удаления пользователя {" "}
            <strong>{user.username}</strong>
          </span>
        </div>

        <div className="mt-6">
          <Link
            href={editUrl}
            className="btn btn-primary"
          >
            ← Вернуться к списку пользователей
          </Link>

        </div>
      </div>
    )
  }

  const action = deleteUserAction.bind(
    null,
    user.username
  );

  return (
    <main className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">
        Вы действительно хотите удалить пользователя:
      </h1>

      <table className="table">
        <tbody>
          <tr>
            <th>Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th>Имя</th>
            <td>{user.name}</td>
          </tr>
          <tr>
            <th>Роль</th>
            <td>{user.role}</td>
          </tr>
          <tr>
            <th>Активен</th>
            <td>
              <input
                type="checkbox"
                className="checkbox"
                checked={user.active}
                readOnly
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex gap-4 mt-6">

        <form action={action}>
          <button
            type="submit"
            className="btn btn-error"
          >
            Удалить пользователя
          </button>
        </form>

        <Link
          href={editUrl}
          className="btn btn-outline"
        >
          ← Вернуться в карточку пользователя
        </Link>
      </div>
    </main>
  );
}