import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Veuillez saisir une adresse email valide.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const dir = path.join(process.cwd(), 'data', 'submissions');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, 'newsletter.json');
    let subscribers: Array<{ email: string; subscribedAt: string }> = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        subscribers = JSON.parse(fileData);
      } catch (e) {
        subscribers = [];
      }
    }

    // Check duplicate
    const exists = subscribers.some(s => s.email === cleanEmail);
    if (!exists) {
      subscribers.push({
        email: cleanEmail,
        subscribedAt: new Date().toISOString()
      });
      fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2), 'utf-8');
    }

    return NextResponse.json({
      success: true,
      message: 'Inscription confirmée ! Vous recevrez la lettre hebdomadaire chaque dimanche.'
    });

  } catch (error) {
    console.error('Newsletter API Error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'enregistrement.' },
      { status: 500 }
    );
  }
}
