'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  postId: number;
}

export default function ViewTracker({ postId }: ViewTrackerProps) {
  useEffect(() => {
    // Track view when component mounts
    const trackView = async () => {
      try {
        await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ postId }),
        });
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, [postId]);

  return null; // This component doesn't render anything
}