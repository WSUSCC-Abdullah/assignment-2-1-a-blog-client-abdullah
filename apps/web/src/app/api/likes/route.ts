import { NextRequest, NextResponse } from 'next/server';
import { client } from '@repo/db/client';

// Helper function to get client IP address
function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || '127.0.0.1';
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a default IP for development
  return '127.0.0.1';
}

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();
    const userIP = getClientIP(request);

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await client.db.post.findUnique({
      where: { id: parseInt(postId) }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user has already liked this post
    const existingLike = await client.db.like.findUnique({
      where: {
        postId_userIP: {
          postId: parseInt(postId),
          userIP: userIP
        }
      }
    });

    if (existingLike) {
      return NextResponse.json(
        { error: 'You have already liked this post' },
        { status: 400 }
      );
    }

    // Create the like
    await client.db.like.create({
      data: {
        postId: parseInt(postId),
        userIP: userIP
      }
    });

    // Get updated like count
    const likeCount = await client.db.like.count({
      where: { postId: parseInt(postId) }
    });

    return NextResponse.json({ 
      success: true, 
      liked: true,
      likeCount 
    });

  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { postId } = await request.json();
    const userIP = getClientIP(request);

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Check if user has liked this post
    const existingLike = await client.db.like.findUnique({
      where: {
        postId_userIP: {
          postId: parseInt(postId),
          userIP: userIP
        }
      }
    });

    if (!existingLike) {
      return NextResponse.json(
        { error: 'You have not liked this post' },
        { status: 400 }
      );
    }

    // Remove the like
    await client.db.like.delete({
      where: {
        postId_userIP: {
          postId: parseInt(postId),
          userIP: userIP
        }
      }
    });

    // Get updated like count
    const likeCount = await client.db.like.count({
      where: { postId: parseInt(postId) }
    });

    return NextResponse.json({ 
      success: true, 
      liked: false,
      likeCount 
    });

  } catch (error) {
    console.error('Error unliking post:', error);
    return NextResponse.json(
      { error: 'Failed to unlike post' },
      { status: 500 }
    );
  }
}