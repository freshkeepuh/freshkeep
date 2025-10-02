import StoreForm from '@/components/StoreForm';
import { randomUUID } from 'crypto';

export default async function StorePage() {
  // Replace with actual logic to get the store id, e.g. from params or context
  const id = randomUUID();
  return <StoreForm id={id} />;
}
