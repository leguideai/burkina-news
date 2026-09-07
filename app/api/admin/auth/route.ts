import { NextResponse } from 'next/server';
import { getAdminStore, saveAdminUsers } from '@/data/admin-store';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Veuillez saisir votre adresse email et votre mot de passe.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const store = getAdminStore();
    const user = (store.users || []).find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides. Vérifiez votre adresse email.' },
        { status: 401 }
      );
    }

    if (user.status === 'suspended') {
      return NextResponse.json(
        { error: 'Ce compte a été suspendu par un Superadministrateur. Veuillez contacter la direction.' },
        { status: 403 }
      );
    }

    // Passwords accepted: user.password or default team passwords
    const validPasswords = ['faso2026', 'burkina2026', 'admin', 'burkina', 'editor'];
    if (user.password) validPasswords.push(user.password);
    
    if (!validPasswords.includes(password)) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect.' },
        { status: 401 }
      );
    }

    // Update lastLogin
    user.lastLogin = new Date().toISOString();
    saveAdminUsers(store.users);

    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      loggedInAt: new Date().toISOString()
    };

    const response = NextResponse.json({
      success: true,
      message: `Bienvenue sur le Desk Burkina News, ${user.name}.`,
      user: sessionData
    });

    // Set cookie
    response.cookies.set('bn_admin_token', JSON.stringify(sessionData), {
      httpOnly: false, // Accessible to client auth guard
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/bn_admin_token=([^;]+)/);

  if (!tokenMatch) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const user = JSON.parse(decodeURIComponent(tokenMatch[1]));
    return NextResponse.json({ authenticated: true, user });
  } catch (e) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Déconnexion réussie.' });
  response.cookies.set('bn_admin_token', '', { path: '/', maxAge: 0 });
  return response;
}
