import DashboardLayout from "@/components/layout/DashboardLayout";
import UsersPageClient from "@/components/users/UsersPageClient";

export const metadata = {
  title: "User Management — E-Skool ERP",
  description: "Admin view of user accounts — roles, status, and password actions (demo UI).",
};

export default function UsersPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <UsersPageClient />
      </main>
    </DashboardLayout>
  );
}
