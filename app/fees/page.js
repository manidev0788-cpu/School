import DashboardLayout from "@/components/layout/DashboardLayout";
import FeesPageClient from "@/components/fees/FeesPageClient";

export const metadata = {
  title: "Fees Management — E-Skool ERP",
  description: "Manage student fees, balances, and payments.",
};

export default function FeesPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <FeesPageClient />
      </main>
    </DashboardLayout>
  );
}
