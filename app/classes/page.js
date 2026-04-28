import DashboardLayout from "@/components/layout/DashboardLayout";
import ClassesPageClient from "@/components/classes/ClassesPageClient";

export const metadata = {
  title: "Classes — E-Skool ERP",
  description: "Manage grades, sections, and homeroom assignments.",
};

export default function ClassesPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <ClassesPageClient />
      </main>
    </DashboardLayout>
  );
}
