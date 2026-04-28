import PortalShell from "@/components/layout/PortalShell";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Parent Dashboard — E-Skool ERP",
  description: "Parent workspace (demo).",
};

export default function ParentDashboardPage() {
  return (
    <PortalShell
      eyebrow="Parent portal"
      title="Family dashboard"
      subtitle="Fees, attendance, and announcements — demo UI for guardian access."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-white/80 p-6 shadow-[0_12px_40px_-16px_rgb(15,23,42,0.12)]">
          <h2 className="text-lg font-bold text-slate-900">Linked students</h2>
          <ul className="mt-6 space-y-3 text-sm font-semibold text-slate-700">
            <li className="flex items-center justify-between rounded-xl bg-emerald-50/80 px-4 py-3 ring-1 ring-emerald-100">
              <span>Aditi Sharma</span>
              <span className="text-xs font-bold uppercase tracking-wide text-emerald-800">Grade 9 · A</span>
            </li>
            <li className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
              <span>Vihaan Mehta</span>
              <span className="text-xs font-bold uppercase tracking-wide text-slate-600">Grade 9 · B</span>
            </li>
          </ul>
        </Card>
        <Card className="border border-white/80 p-6 shadow-[0_12px_40px_-16px_rgb(15,23,42,0.12)]">
          <h2 className="text-lg font-bold text-slate-900">Alerts</h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Fee slip due next week · PT meeting reminder · Sports day registration open (demo content).
          </p>
        </Card>
      </div>
    </PortalShell>
  );
}
