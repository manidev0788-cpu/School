import PortalShell from "@/components/layout/PortalShell";
import { Card } from "@/components/ui/Card";

export const metadata = {
  title: "Teacher Dashboard — E-Skool ERP",
  description: "Teacher workspace (demo).",
};

export default function TeacherDashboardPage() {
  return (
    <PortalShell
      eyebrow="Teacher portal"
      title="Welcome, educator"
      subtitle="Your classes, rosters, and tasks — demo UI for teacher role."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-white/80 p-6 shadow-[0_12px_40px_-16px_rgb(15,23,42,0.12)]">
          <h2 className="text-lg font-bold text-slate-900">Today&apos;s sessions</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">No backend connected — sample placeholders.</p>
          <ul className="mt-6 space-y-3 text-sm font-semibold text-slate-700">
            <li className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">Grade 9 · Mathematics · Period 3</li>
            <li className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">Grade 8 · Science lab · Period 5</li>
          </ul>
        </Card>
        <Card className="border border-white/80 p-6 shadow-[0_12px_40px_-16px_rgb(15,23,42,0.12)]">
          <h2 className="text-lg font-bold text-slate-900">Quick actions</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-xl bg-[#1d4ed8]/10 px-4 py-2 text-sm font-bold text-[#1d4ed8]">Take attendance</span>
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Upload assignment</span>
            <span className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Message parents</span>
          </div>
        </Card>
      </div>
    </PortalShell>
  );
}
