import { redirect, notFound } from 'next/navigation';
import { isLoggedIn } from '../../../../utils/auth';
import { getPostById } from '@repo/db/service';
import AdminLayout from '../../../../components/AdminLayout';
import dynamic from 'next/dynamic';

const EditPostForm = dynamic(() => import('../../../../components/EditPostForm'), {
  ssr: false
});

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect('/');
  }

  const { id } = await params;
  const postId = parseInt(id);
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return (
    <AdminLayout>
      <EditPostForm post={post} />
    </AdminLayout>
  );
}