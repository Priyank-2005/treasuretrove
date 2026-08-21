import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.isLoggedIn) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        phone: session.phone,
        joinedDate: session.joinedDate,
      },
    });
  } catch (error) {
    console.error('Get session error:', error);
    return NextResponse.json({ user: null });
  }
}
