import AdminAuthGate from '@/components/admin/AdminAuthGate';

/**
 * Admin-specific layout – Protected with Supabase Admin Authentication.
 * The admin portal is visually and functionally distinct from the storefront.
 */
export default function AdminLayout({
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
