import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import StoreForm from '@/components/StoreForm';

export default async function StorePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(session);

  // Use the actual store id from route params
  return <StoreForm params={params} />;
}
