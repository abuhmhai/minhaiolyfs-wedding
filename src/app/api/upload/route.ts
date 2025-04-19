import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    const urls = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}-${file.name}`;
        const filepath = join(uploadsDir, filename);
        
        // Write the file to the uploads directory
        await writeFile(filepath, buffer);
        
        // Return the URL path
        return `/uploads/${filename}`;
      })
    );

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
} 