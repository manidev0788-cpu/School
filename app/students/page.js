import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentsPageClient from "@/components/students/StudentsPageClient";

export const metadata = {
  title: "Students — E-Skool ERP",
  description: "Manage student records, classes, and guardian information.",
};

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <StudentsPageClient />
      </main>
    </DashboardLayout>
  );
}
