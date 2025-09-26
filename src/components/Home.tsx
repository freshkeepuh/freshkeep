'use client';

import { useSession } from 'next-auth/react';
import Welcome from '@/components/Welcome';
import Dashboard from '@/components/Dashboard';
import LoadingSpinner from './LoadingSpinner';

/** The Home page. */
const Home = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (session) {
    return <Dashboard session={session} />;
  }
  return <Welcome />;
};

export default Home;
