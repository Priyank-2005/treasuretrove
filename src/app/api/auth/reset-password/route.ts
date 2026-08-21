import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Email and new password are required' },
        { status: 400 }
      );
    }

    // For "request reset" flow (email only, no otp/newPassword)
    if (!otp) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Email not found' },
          { status: 404 }
        );
      }

      console.log(`[DEV] Password reset OTP for ${email}: 123456 (any 6-digit code works)`);

      return NextResponse.json({
        success: true,
        message: 'Password reset OTP sent',
      });
    }

    // Validate OTP (any 6-digit code works in dev)
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
