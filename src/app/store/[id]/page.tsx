import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import StoreForm from '@/components/StoreForm';

export default async function StorePage(context: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  await loggedInProtectedPage(session);

  // Use the actual store id from route params
  const { id } = { ...(context.params) };
  return <StoreForm params={{ id }} />;
}
