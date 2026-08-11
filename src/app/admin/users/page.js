import { auth } from "@/auth";
import { getUsers } from "@/lib/auth/users";
import Link from "next/link"
import { canEditUser, canDeleteUser, canCreateUser } from "@/lib/auth/permissions";

export default async function UsersPage() {

  const session = await auth();

  const actor = session.user;

  const users = await getUsers();

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">
        Пользователи
      </h1>

      {canCreateUser(actor) && (
        <Link
          href="/admin/users/new"
          className="btn btn-primary"
        >
          + Создать пользователя
        </Link>
      )}
      </div>

      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Username</th>
            <th>Имя</th>
            <th>Роль</th>
            <th>Активен</th>
            <th>Действия</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const canEdit = canEditUser(actor, user);
            const canDelete = canDeleteUser(actor, user);
            return (
              <tr key={user.username}>
                <td>
                  {/* <Link
                    href={`/admin/users/${user.username}`}
                    className="link Link-primary"
                  >
                    {user.username}
                  </Link> */}
                  {user.username}
                </td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.active ? "✅" : "❌"}</td>
                <td>
                  {canEdit && (
                    <Link
                      href={`/admin/users/${user.username}`}
                      className="btn btn-sm btn-primary"
                    >
                      ✏️ Редактировать
                    </Link>
                  )}

                  {canDelete && (
                    <Link
                      href={`/admin/users/${user.username}/delete`}
                      className="btn btn-sm btn-error ml-2"
                    >
                      🗑 Удалить
                    </Link>
                  )}

                </td>

              </tr>
            );
          })}

        </tbody>

      </table>

    </main>
  )

}