import AppSidebar from "@/components/layouts/navigation";
import Header from "@/components/layouts/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppSidebar />
      <div className="ml-44 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
