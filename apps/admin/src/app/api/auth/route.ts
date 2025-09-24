import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { env } from '@repo/env/admin';

// Hard-coded password as per requirements (keeping it as "123" to match tests)
const ADMIN_PASSWORD = '123';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      // Create JWT token
      const token = jwt.sign(
        { 
          admin: true,
          iat: Math.floor(Date.now() / 1000)
        },
        env.JWT_SECRET,
        { 
          expiresIn: '7d' // Token expires in 7 days
        }
      );

      // Set httpOnly cookie with JWT token
      const cookieStore = await cookies();
      cookieStore.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during authentication' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    // Remove the auth_token cookie to log out
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    );
  }
}