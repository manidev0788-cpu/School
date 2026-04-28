import DashboardLayout from "@/components/layout/DashboardLayout";
import AttendancePageClient from "@/components/attendance/AttendancePageClient";

export const metadata = {
  title: "Attendance — E-Skool ERP",
  description: "Mark and review class attendance.",
};

export default function AttendancePage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <AttendancePageClient />
      </main>
    </DashboardLayout>
  );
}
