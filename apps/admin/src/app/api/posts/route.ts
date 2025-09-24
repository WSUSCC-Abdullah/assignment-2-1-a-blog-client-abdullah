import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // In a real app, this would save to the database
    // For now, we'll just simulate success
    console.log('Creating post:', data);
    
    return NextResponse.json({ success: true, id: Date.now() });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}