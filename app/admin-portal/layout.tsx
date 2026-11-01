import AdminAuthGate from '@/components/admin/AdminAuthGate';

export default function AdminPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGate>
      <div className="min-h-screen bg-slate-50 flex flex-col overflow-y-auto">
        {children}
      </div>
    </AdminAuthGate>
  );
}
