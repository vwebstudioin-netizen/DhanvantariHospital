import { redirect } from "next/navigation";

// Registration is handled automatically via Google Sign-In
export default function RegisterPage() {
  redirect("/portal/login");
}
