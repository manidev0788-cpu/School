import DashboardLayout from "@/components/layout/DashboardLayout";
import ResultsPageClient from "@/components/results/ResultsPageClient";

export const metadata = {
  title: "Exam & Results — E-Skool ERP",
  description: "Manage exam marks, totals, and grades.",
};

export default function ResultsPage() {
  return (
    <DashboardLayout>
      <main className="flex min-w-0 flex-1 flex-col gap-8">
        <ResultsPageClient />
      </main>
    </DashboardLayout>
  );
}
