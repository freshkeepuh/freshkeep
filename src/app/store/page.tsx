import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import StoreForm from '@/components/StoreForm';
import { loggedInProtectedPage } from '@/lib/page-protection';

export default async function StorePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(session);

  // Use the actual store id from route params
  const { id } = params;
  return <StoreForm id={id} />;
}
