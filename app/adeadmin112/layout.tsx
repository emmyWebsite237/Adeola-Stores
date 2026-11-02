import AdminAuthGate from '@/components/admin/AdminAuthGate';

export const metadata = {
  title: 'Ladydee Minimart Management (AdeAdmin112)',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdeAdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGate>{children}</AdminAuthGate>;
}