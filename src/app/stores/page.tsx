import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import StoresForm from '@/components/StoresForm';

export default async function StoresPage() {
  const session = await getServerSession(authOptions);
  await loggedInProtectedPage(session);

  return <StoresForm />;
}
