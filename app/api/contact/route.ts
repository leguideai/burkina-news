import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, url, desc, source, email, name, category, message } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Une adresse email valide est requise.' },
        { status: 400 }
      );
    }

    if (type === 'error_report') {
      if (!desc || !source) {
        return NextResponse.json(
          { error: 'Veuillez préciser la description de l\'erreur et la source primaire contradictoire.' },
          { status: 400 }
        );
      }
    } else {
      if (!name || !message) {
        return NextResponse.json(
          { error: 'Le nom et le message sont requis pour une prise de contact.' },
          { status: 400 }
        );
      }
    }

    const submission = {
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      type: type || 'general',
      email: email.trim(),
      ...(type === 'error_report' 
        ? { url: url || '', description: desc, source } 
        : { name, category: category || 'general', message })
    };

    // Store in local submissions directory
    const dir = path.join(process.cwd(), 'data', 'submissions');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, 'contacts.json');
    let submissions = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        submissions = JSON.parse(fileData);
      } catch (e) {
        submissions = [];
      }
    }

    submissions.push(submission);
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: type === 'error_report'
        ? 'Votre signalement a été enregistré avec succès. Il sera instruit sous 48 heures par le Desk Investigation.'
        : 'Votre message a bien été transmis à la rédaction.'
    });

  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Une erreur serveur est survenue lors de l\'enregistrement.' },
      { status: 500 }
    );
  }
}
