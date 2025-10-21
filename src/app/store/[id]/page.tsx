import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import StoreForm from '@/components/StoreForm';

export default async function StorePage({ params }: { params: { id: string } } | any) {
  const session = await getServerSession(authOptions);
  await loggedInProtectedPage(session);

  // Use the actual store id from route params
  // const { id } = params;
  return <StoreForm params={params} />;
}
