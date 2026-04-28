import DashboardLayout from "@/components/layout/DashboardLayout";
import TeachersPageClient from "@/components/teachers/TeachersPageClient";

export const metadata = {
  title: "Teachers — E-Skool ERP",
  description: "Manage faculty, subjects, and class assignments.",
};

export default function TeachersPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <TeachersPageClient />
      </main>
    </DashboardLayout>
  );
}
