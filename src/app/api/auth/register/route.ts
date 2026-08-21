import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // For local dev: store pending registration in response
    // OTP is simulated — any 6-digit code works
    // In production, we'd send a real OTP to the email
    console.log(`[DEV] OTP for ${email}: 123456 (any 6-digit code works)`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      // Pass registration data back so the client can send it with OTP verification
      pendingData: { name, email: email.toLowerCase(), phone: phone || '', password },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
