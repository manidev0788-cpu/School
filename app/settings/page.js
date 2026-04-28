import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPageClient from "@/components/settings/SettingsPageClient";

export const metadata = {
  title: "Settings — E-Skool ERP",
  description: "School profile, account preferences, and theme.",
};

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <SettingsPageClient />
      </main>
    </DashboardLayout>
  );
}
