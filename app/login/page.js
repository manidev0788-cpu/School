import { redirect } from "next/navigation";

/** Legacy URL — login lives at `/`. */
export default function LoginRedirectPage() {
  redirect("/");
}
