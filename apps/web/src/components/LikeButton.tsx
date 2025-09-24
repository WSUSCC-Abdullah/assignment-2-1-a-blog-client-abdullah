'use client';

import { useState } from 'react';

interface LikeButtonProps {
  postId: number;
  initialLikes: number;
  initialUserHasLiked: boolean;
}

export default function LikeButton({ 
  postId, 
  initialLikes, 
  initialUserHasLiked 
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [userHasLiked, setUserHasLiked] = useState(initialUserHasLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeToggle = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/likes', {
        method: userHasLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likeCount);
        setUserHasLiked(data.liked);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
        userHasLiked
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      <span className="text-xl">
        {userHasLiked ? '❤️' : '🤍'}
      </span>
      <span className="font-medium">
        {likes} {likes === 1 ? 'Like' : 'Likes'}
      </span>
      {isLoading && (
        <span className="text-sm">...</span>
      )}
    </button>
  );
}