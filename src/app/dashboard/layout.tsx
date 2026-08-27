import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/current-user';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}
