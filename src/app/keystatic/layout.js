import { auth } from "@/auth";
import { redirect } from "next/navigation";
import KeystaticApp from "./keystatic";
// import { USER_ROLES } from "@/lib/auth/constants";
import { canAccessKeystatic } from "@/lib/auth/permissions";
export default async function Layout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // const allowedRoles = ["superadmin", "admin", "editor"];
  // if (session.user.role !== "admin" && session.user.role !== "editor") {
  // if (!allowedRoles.includes(session.user.role)) {
  // if (!Object.values(USER_ROLES).slice(0, 3).includes(session.user.role)) {
  if (!canAccessKeystatic(session.user)) {
    return (
      <main>
        <h1>Access denied</h1>
        <p>Недостаточно прав.</p>
      </main>
    );
  }

  return (
    <KeystaticApp />
  );
}

// export default function Layout() {
//   return (
//     <KeystaticApp />
//   );
// }
// import { Navigation } from "../../ui/navigation/navigation";

// export default function Layout({ children }) {
//   return (
//     <>
//       <Navigation />

//       {children}
//     </>
//   );
// }