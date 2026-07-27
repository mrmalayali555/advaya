import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  const extension = filename.split('.').pop()?.toLowerCase() || '';
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];

  if (!allowedExtensions.includes(extension)) {
    return NextResponse.json({ error: 'Only images (jpg, png) and PDF files are allowed' }, { status: 400 });
  }

  // 5MB limit
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
  }

  if (!request.body) {
    return NextResponse.json({ error: 'No file body provided' }, { status: 400 });
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
