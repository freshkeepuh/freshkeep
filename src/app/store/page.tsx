import { useSession } from 'next-auth/react';
import StoreForm from '@/components/StoreForm';
import { loggedInProtectedPage } from '@/lib/page-protection';

export default async function StorePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  loggedInProtectedPage(session);

  // Use the actual store id from route params
  const { id } = params;
  return <StoreForm id={id} />;
}
