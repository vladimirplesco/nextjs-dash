// import { createUserAction } from "./actions";
import Link from "next/link";
import CreateUserForm from "./CreateUserForm"
export default async function CreateUserPage() {
  return (
    <main className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">
        Создать пользователя
      </h1>

      <CreateUserForm />

      <div>
        <Link
          href="/admin/users"
          className="btn btn-outline"
          >
            ← Назад к списку пользователей
        </Link>
      </div>
      </main>
  )
}