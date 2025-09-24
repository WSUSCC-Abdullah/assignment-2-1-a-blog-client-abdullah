import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@repo/db/service';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'content', 'tags', 'imageUrl'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Default category if not provided
    if (!data.category) {
      data.category = 'General';
    }

    const post = await createPost(data);
    
    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}