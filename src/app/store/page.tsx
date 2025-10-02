import StoreForm from '@/components/StoreForm';
import { randomUUID } from 'crypto';

export default async function StorePage({ params }: { params: { id: string } }) {
  // Use the actual store id from route params
  const id = params.id;
  return <StoreForm id={id} />;
}
