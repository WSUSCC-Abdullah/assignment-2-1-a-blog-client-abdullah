'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';
import dynamic from 'next/dynamic';

const EditPostForm = dynamic(() => import('../../../../components/EditPostForm'), {
  ssr: false
});

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

interface Post {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string;
  date: Date;
  views: number;
  likes: number;
  active: boolean;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthAndLoadPost = async () => {
      try {
        // Check authentication
        const authResponse = await fetch('/api/auth');
        if (!authResponse.ok) {
          router.push('/');
          return;
        }

        // Get post ID from params
        const resolvedParams = await params;
        const postId = parseInt(resolvedParams.id);

        // Fetch post data
        const postResponse = await fetch(`/api/posts/${postId}`);
        if (!postResponse.ok) {
          if (postResponse.status === 404) {
            setError('Post not found');
          } else {
            setError('Failed to load post');
          }
          return;
        }

        const postData = await postResponse.json();
        // Convert date string to Date object
        postData.date = new Date(postData.date);
        setPost(postData);
      } catch (err) {
        setError('An error occurred while loading the post');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadPost();
  }, [params, router]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  if (!post) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Post not found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <EditPostForm post={post} />
    </AdminLayout>
  );
}