import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, user } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token não fornecido' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, user });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ message: 'Falha ao definir sessão' }, { status: 500 });
  }
}
