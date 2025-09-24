'use client';

import { useRouter } from 'next/navigation';
import { Post } from '@repo/db/data';
import PostForm from '../../../../components/PostForm';

interface EditPostClientProps {
  post: Post;
}

export default function EditPostClient({ post }: EditPostClientProps) {
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    }
  };

  return (
    <PostForm 
      initialData={post} 
      isEdit={true}
      onSave={handleSave} 
    />
  );
}