import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    
    const cookieStore = await cookies();
    // Remove the auth_token cookie to log out
    cookieStore.delete('auth_token');
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}