import { redirect } from 'next/navigation';
import { isLoggedIn } from '../../../utils/auth';
import AdminLayout from '../../../components/AdminLayout';

// Import the client component directly with a dynamic import to avoid SSR issues
import dynamic from 'next/dynamic';

const CreatePostClient = dynamic(() => import('../../../components/CreatePostForm'), {
  ssr: false
});

export default async function CreatePostPage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect('/');
  }

  return (
    <AdminLayout>
      <CreatePostClient />
    </AdminLayout>
  );
}