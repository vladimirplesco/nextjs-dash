import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { USER_ROLES} from "@/lib/auth/constants";

export default async function AfterLoginPage()
 {
  const session = await auth();
  // console.log("SESSION =", session);
  if(!session) {
    redirect("/login");
  }

  const role = session.user.role;

  if(role === USER_ROLES.ADMIN || role === USER_ROLES.SUPERADMIN) {
    redirect("/admin");
  } else if (role === USER_ROLES.EDITOR) {
    redirect("/keystatic");
  } else {
    redirect("/");
  }

}
