import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { readStorageArea } from '@/lib/dbStorageAreaActions';
import StorageDetail from '@/components/dashboard/StorageDetail';
import { prisma } from '@/lib/prisma';

export default async function StorageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  await loggedInProtectedPage(session);

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || '' },
    select: { id: true },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const storageArea = await readStorageArea(user.id, id);

  return <StorageDetail storage={storageArea} />;
}