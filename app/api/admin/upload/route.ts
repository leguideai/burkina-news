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

    // Determine folder by entity type (Section 12.3: sources/, projects/, content/, issues/)
    const rawFolder = ((formData.get('folder') as string) || (formData.get('entity') as string) || '').toLowerCase();
    const validFolders = ['sources', 'projects', 'content', 'issues'];
    
    // Auto-detect folder if not specified
    let targetFolder = validFolders.includes(rawFolder) ? rawFolder : 'content';
    if (!rawFolder) {
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        targetFolder = 'sources';
      }
    }

    const origName = file.name || 'document';
    const ext = path.extname(origName) || `.${file.type.split('/')[1] || 'jpg'}`;
    const cleanBase = path
      .basename(origName, ext)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 35)
      .replace(/^-+|-+$/g, '') || 'file';

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    
    // Standardized nomenclature: prefix by entity type (e.g. source-pnd-2026-..., project-kodeni-...)
    const prefix = targetFolder === 'sources' ? 'source' : targetFolder === 'projects' ? 'project' : targetFolder === 'issues' ? 'issue' : 'doc';
    const normalizedName = cleanBase.startsWith(prefix) ? cleanBase : `${prefix}-${cleanBase}`;
    const fileName = `${normalizedName}-${timestamp}-${randomSuffix}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', targetFolder);
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${targetFolder}/${fileName}`;

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
