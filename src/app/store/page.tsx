import StoreForm from '@/components/StoreForm';

// Define PageProps type for '/store/[id]' route
type StorePageProps<T extends string> = {
  params: { id: string };
};

export default async function StorePage(props: StorePageProps<'/store/[id]'>) {
  // Replace with actual logic to get the store id, e.g. from params or context
  const { id } = await props.params;
  return <StoreForm id={id} />;
}
