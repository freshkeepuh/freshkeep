'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/createClient';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sbAuthTest/signin');
  };

  return (
    <button onClick={handleSignOut} className="text-red-500 hover:underline" type="button">
      Sign Out
    </button>
  );
}
