'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/AdminLayout';
import dynamic from 'next/dynamic';

const CreatePostClient = dynamic(() => import('../../../components/CreatePostForm'), {
  ssr: false
});

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authResponse = await fetch('/api/auth');
        if (!authResponse.ok) {
          router.push('/');
          return;
        }
      } catch (err) {
        router.push('/');
        return;
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <CreatePostClient />
    </AdminLayout>
  );
}