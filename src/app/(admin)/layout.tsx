import type { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col gap-6 p-8">{children}</main>
    </div>
  );
}
