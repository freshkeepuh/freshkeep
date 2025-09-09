import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/createServerClient';
import AddStuffForm from '@/app/sbAuthTest/components/AddStuffForm';

const AddStuff = async () => {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    redirect('/sbAuthTest/signin');
  }

  return (
    <main>
      <AddStuffForm />
    </main>
  );
};

export default AddStuff;
