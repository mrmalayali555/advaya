import { Metadata } from "next";
import { LoginForm } from "./login-form";
import { LogoMark } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-ink-950 px-6">
      <div className="pointer-events-none absolute inset-0 bg-mesh opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-600/25 blur-[130px]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
            <LogoMark variant="dark" className="h-9 w-9" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-white">ADVAYA Admin</h1>
          <p className="mt-1 text-sm text-white/50">Sign in to manage the website.</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          Authorised personnel only. All activity is monitored.
        </p>
      </div>
    </main>
  );
}
