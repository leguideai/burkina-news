import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Validate mime type (Images & Documents)
    const validMimes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'image/svg+xml',
      'image/avif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'text/markdown',
      'application/json',
    ];
    if (!validMimes.includes(file.type) && !file.name.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Format non supporté. Formats acceptés : Images (JPG, PNG, WebP, GIF, SVG) et Documents (PDF, DOCX, TXT, CSV, MD).' },
        { status: 400 }
      );
    }

    // Max file size 25MB
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier dépasse la taille maximale autorisée (25 Mo).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const origName = file.name || 'image';
    const ext = path.extname(origName) || `.${file.type.split('/')[1] || 'jpg'}`;
    const baseName = path
      .basename(origName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 30);
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    const fileName = `${baseName || 'img'}-${timestamp}-${randomSuffix}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: "Échec de l'enregistrement de l'image sur le serveur." },
      { status: 500 }
    );
  }
}
