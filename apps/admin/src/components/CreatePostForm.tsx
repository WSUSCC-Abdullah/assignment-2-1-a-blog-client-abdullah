'use client';

import { useRouter } from 'next/navigation';
import PostForm from './PostForm';

export default function CreatePostForm() {
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  return <PostForm onSave={handleSave} />;
}