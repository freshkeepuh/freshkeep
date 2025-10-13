'use client';

import { useSession } from 'next-auth/react';
import Dashboard from '@/components/Dashboard';
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
      <Dashboard session={{
        user: {
          email: session.user?.email,
        // name: session.user.name,
        // image: session.user.image,
        },
      }}
      />
    );
  }
  return <Welcome />;
};

export default Home;
