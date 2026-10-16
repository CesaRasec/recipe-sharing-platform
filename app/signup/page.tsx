import Link from "next/link";
import { redirect } from "next/navigation";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { getAuthUser } from "@/lib/auth";

export default async function SignUpPage() {
  const user = await getAuthUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
      <p className="text-sm text-stone-600">
        Email sign-up only. If confirmation is enabled, check your inbox after
        submitting.
      </p>
      <SignUpForm />
      <p className="text-sm text-stone-600">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-orange-800 hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
