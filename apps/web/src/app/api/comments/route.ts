import { NextRequest, NextResponse } from 'next/server';
import { client } from '@repo/db/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const comments = await (client.db as any).comment.findMany({
      where: { 
        postId: parseInt(postId),
        parentId: null // Only get top-level comments
      },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { postId, content, author, email, parentId } = await request.json();

    if (!postId || !content || !author || !email) {
      return NextResponse.json(
        { error: 'Post ID, content, author, and email are required' },
        { status: 400 }
      );
    }

    // Validate email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
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

    // If parentId is provided, check if parent comment exists
    if (parentId) {
      const parentComment = await (client.db as any).comment.findUnique({
        where: { id: parseInt(parentId) }
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    const comment = await (client.db as any).comment.create({
      data: {
        postId: parseInt(postId),
        content: content.trim(),
        author: author.trim(),
        email: email.trim(),
        parentId: parentId ? parseInt(parentId) : null
      },
      include: {
        replies: true
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}