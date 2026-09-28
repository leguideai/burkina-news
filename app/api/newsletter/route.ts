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

    // 1. Tenter l'enregistrement dans le backend Go
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    try {
      await fetch(`${apiUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, source: 'website' }),
      });
    } catch (backendErr) {
      // Ignorer si backend indisponible, conservation du fallback local
    }

    // 2. Persistance locale JSON
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
