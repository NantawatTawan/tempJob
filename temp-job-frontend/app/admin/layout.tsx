import { AdminProtectedRoute } from "@/shared/components/routes/AdminProtectedRoute";
import AdminSideBar from "./_components/AdminSideBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <div className="flex min-h-screen bg-primary">
        <AdminSideBar />
        <main className="flex-1 p-6 overflow-auto pt-24">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </AdminProtectedRoute>
  );
}
