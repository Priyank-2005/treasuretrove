import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { sessionOptions, SessionData } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { otp, pendingData, purpose } = await request.json();

    // Validate OTP format (any 6-digit code works in dev)
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Must be 6 digits.' },
        { status: 400 }
      );
    }

    // Registration OTP verification
    if (purpose === 'register' && pendingData) {
      const { name, email, phone, password } = pendingData;

      // Double-check user doesn't exist
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 409 }
        );
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || null,
          password: hashedPassword,
          role: 'CUSTOMER',
        },
      });

      // Create session
      const cookieStore = await cookies();
      const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

      session.userId = newUser.id;
      session.name = newUser.name;
      session.email = newUser.email;
      session.phone = newUser.phone || '';
      session.role = newUser.role;
      session.joinedDate = newUser.joinedDate.toISOString().split('T')[0];
      session.isLoggedIn = true;

      await session.save();

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || '',
          joinedDate: newUser.joinedDate.toISOString().split('T')[0],
        },
      });
    }

    // Password reset OTP verification
    if (purpose === 'reset') {
      return NextResponse.json({ success: true, message: 'OTP verified' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
