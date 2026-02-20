import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "./Header";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background text-foreground w-full overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Section (Header + Content) */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 p-4 pt-12 overflow-x-auto overflow-y-auto bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
