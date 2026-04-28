import DashboardLayout from "@/components/layout/DashboardLayout";
import ActivityLogsPageClient from "@/components/activity/ActivityLogsPageClient";

export const metadata = {
  title: "Activity Logs — E-Skool ERP",
  description: "Admin activity timeline (demo UI).",
};

export default function ActivityLogsPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <ActivityLogsPageClient />
      </main>
    </DashboardLayout>
  );
}
