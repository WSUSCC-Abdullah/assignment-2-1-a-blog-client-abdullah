'use client';

import { useEffect, useRef } from 'react';

interface ViewTrackerProps {
  postId: number;
}

export default function ViewTracker({ postId }: ViewTrackerProps) {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Prevent duplicate tracking during React Strict Mode or re-renders
    if (hasTracked.current) {
      return;
    }

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
        hasTracked.current = true;
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackView();
  }, [postId]);

  return null; // This component doesn't render anything
}