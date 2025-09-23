'use client';

import { useSession } from 'next-auth/react';
import Welcome from '@/components/Welcome';
import Dashboard from '@/components/Dashboard';

/** The Home page. */
const Home = () => {
  const { data: session } = useSession();

  if (session) {
    return <Dashboard />;
  }
  return <Welcome />;
};

export default Home;
