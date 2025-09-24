import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Hard-coded admin password as per requirements
const ADMIN_PASSWORD = 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Create httpOnly cookie named "auth_token" as per requirements
      const response = NextResponse.json({ success: true });
      
      const cookieStore = await cookies();
      cookieStore.set('auth_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}