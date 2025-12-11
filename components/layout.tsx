"use client";

import Navigation from "./layouts/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider
      defaultOpen={false}
      style={{
        "--sidebar-width": "13rem",
        "--sidebar-width-icon": "3rem",
      } as React.CSSProperties}
    >
      <Navigation />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}	