import { NextRequest, NextResponse } from 'next/server';
import { client } from '@repo/db/client';

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Increment view count
    const updatedPost = await client.db.post.update({
      where: { id: parseInt(postId) },
      data: {
        views: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      views: updatedPost.views 
    });

  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}