import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentProfilePage from "@/components/students/StudentProfilePage";

export const metadata = {
  title: "Student profile — E-Skool ERP",
  description: "View student record and guardian details.",
};

export default function StudentProfileRoute() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <StudentProfilePage />
      </main>
    </DashboardLayout>
  );
}
