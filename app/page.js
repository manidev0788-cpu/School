import { Suspense } from "react";
import LoginPageClient from "@/components/auth/LoginPageClient";

export const metadata = {
  title: "Sign in — E-Skool ERP",
  description: "Sign in to your school management workspace.",
};

export default function HomeLoginPage() {
  return (
    <Suspense fallback={<div className="erp-page-bg min-h-[100dvh]" aria-busy />}>
      <LoginPageClient />
    </Suspense>
  );
}
