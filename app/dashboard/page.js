import DashboardLayout from "@/components/layout/DashboardLayout";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import StatsSection from "@/components/dashboard/StatsSection";
import AssignmentSection from "@/components/dashboard/AssignmentSection";
import LessonSection from "@/components/dashboard/LessonSection";
import DashboardRightSidebar from "@/components/dashboard/DashboardRightSidebar";

export const metadata = {
  title: "Dashboard — E-Skool ERP",
  description: "School management overview.",
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-12 xl:max-w-[calc(100%-380px)]">
        <WelcomeCard />
        <StatsSection />
        <AssignmentSection />
        <LessonSection />
      </main>

      <DashboardRightSidebar />
    </DashboardLayout>
  );
}
