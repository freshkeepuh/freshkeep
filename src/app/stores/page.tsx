import { useSession } from 'next-auth/react';
import StoresForm from '@/components/StoresForm';
import { loggedInProtectedPage } from '@/lib/page-protection';

export default function StoresPage() {
  const { data: session } = useSession();
  loggedInProtectedPage(session);

  return <StoresForm />;
}
