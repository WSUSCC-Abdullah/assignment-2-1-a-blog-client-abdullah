import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { isLoggedIn } from '../../../utils/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authenticated = await isLoggedIn();
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an image file.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directories for both admin and web apps
    const adminUploadsDir = join(process.cwd(), 'public', 'uploads');
    const webUploadsDir = join(process.cwd(), '..', 'web', 'public', 'uploads');

    if (!existsSync(adminUploadsDir)) {
      await mkdir(adminUploadsDir, { recursive: true });
    }
    if (!existsSync(webUploadsDir)) {
      await mkdir(webUploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Save to both admin and web directories
    const adminFilepath = join(adminUploadsDir, filename);
    const webFilepath = join(webUploadsDir, filename);

    await writeFile(adminFilepath, buffer);
    await writeFile(webFilepath, buffer);

    // Return the public URL
    const imageUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      filename 
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}