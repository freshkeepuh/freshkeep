import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { readStorage } from '@/lib/dbStorageActions';
import StorageDetail from '@/components/dashboard/StorageDetail';

export default async function StorageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  await loggedInProtectedPage(session);

  // In this project, dynamic route params are awaited (see store/[id]/page.tsx)
  const { id } = await params;
  const storage = await readStorage(id);
  return <StorageDetail storage={storage} />;
}
