import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="erp-page-bg min-h-screen">
      <Sidebar />

      <div className="pl-[272px]">
        <Header />

        <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-7 pb-14 pt-7 xl:flex-row xl:items-start xl:gap-12 xl:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
