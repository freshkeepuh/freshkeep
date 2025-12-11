'use client';

import { useSession } from 'next-auth/react';
import DashboardPage from '@/app/dashboard/page';
import LoadingSpinner from '@/components/LoadingSpinner';
import Welcome from '@/components/Welcome';

/** The Home page. */
function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (session) {
    return <DashboardPage />;
  }
  return <Welcome />;
}

export default Home;
