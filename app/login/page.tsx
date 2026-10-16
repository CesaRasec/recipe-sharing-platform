import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/SignInForm";
import { getAuthUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getAuthUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10">
      <SignInForm />
    </main>
  );
}
