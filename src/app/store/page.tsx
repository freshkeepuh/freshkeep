import StoreForm from '@/components/StoreForm';
import { useSearchParams } from 'next/navigation';

export default function StorePage() {
  const searchParams = useSearchParams();
  if (!searchParams.get('id')) {
    throw new Error('Missing required parameter: id');
  }
return <StoreForm id={searchParams.get('id')} />;
}
