'use client';

import { useSession } from 'next-auth/react';
import Dashboard from '@/app/dashboard/page';
import LoadingSpinner from '@/components/LoadingSpinner';
import Welcome from '@/components/Welcome';

/** The Home page. */
const Home = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (session) {
    return (
      <Dashboard />
    );
  }
  return <Welcome />;
};

export default Home;
