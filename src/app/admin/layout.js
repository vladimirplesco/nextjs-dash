import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import { USER_ROLES } from "@/lib/auth/constants";
import { canAccessAdmin } from "@/lib/auth/permissions";

export default async function AdminLayout({
  children,
}) {
  const session = await auth();

  if (!session) {
    // return <h1>Необходимо войти.</h1>
    redirect("/login");
  }

  // const role = session.user.role;

  // if (role !== USER_ROLES.ADMIN &&
  //     role !== USER_ROLES.SUPERADMIN) {
  //   // return <h1>Доступ запрещён.</h1>
  //   redirect("/");
  // }

  if (!canAccessAdmin(session.user)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-6">
          Администрирование
        </h2>

        <ul className="menu">
          <li>
            <Link href="/admin">
              🏠 Dashboard
            </Link>
          </li>

          <li>
            <Link href="/admin/people">
              📄 People
            </Link>

          </li>

          <li>
            <Link href="/admin/users">
              👥 Users
            </Link>
          </li>

        </ul>

      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>


    </div>
  );
}