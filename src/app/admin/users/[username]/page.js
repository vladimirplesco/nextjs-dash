// import { notFound } from "next/navigation";
import { getUser } from "@/lib/auth/users";
import Link from "next/link";
import EditUserForm from "./EditUserForm";
import PasswordChangeForm from "./PasswordChangeForm";
import { auth } from "@/auth";
import { redirect, notFound} from "next/navigation";
import { canEditUser, canDeleteUser } from "@/lib/auth/permissions";

export default async function UserPage({
  params,
}) {

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const actor = session.user;

  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  if (!canEditUser(actor, user)) {
    // redirect("/admin/users");
    return (
      <div className="max-w-xl">
        <div className="alert alert-error">
          <span>
            У вас недостаточно прав для редактирования пользователя{" "}
            <strong>{user.username}</strong>
          </span>
        </div>

        <div className="mt-6">
          <Link
            href="/admin/users"
            className="btn btn-primary"
          >
            ← Вернуться к списку пользователей
          </Link>

        </div>

      </div>
    );
  }

  const canDelete = canDeleteUser(actor, user);

  return (
    <main className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">
        Пользователь
      </h1>

      <EditUserForm
        user={user}
      />
      <PasswordChangeForm
        username={user.username}
      />

      <div className="flex gap-4 mt-6">
        <Link
          href="/admin/users"
          className="btn btn-outline"
          >
            ← Назад к списку пользователей
        </Link>
        { canDelete && (
          <Link
            href={`/admin/users/${user.username}/delete`}
            className="btn btn-error"
          >
            🗑 Удалить пользователя
          </Link>
        )}
      </div>
    </main>
  );
}