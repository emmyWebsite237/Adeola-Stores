/**
 * Admin-specific layout – NO store header, footer, or category pills.
 * The admin portal is visually and functionally distinct from the storefront.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-y-auto">
      {children}
    </div>
  );
}
