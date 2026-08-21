import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed — invalid signature' },
        { status: 400 }
      );
    }

    // Update payment and order status in a transaction
    await prisma.$transaction(async (tx) => {
      // Update payment record
      await tx.payment.updateMany({
        where: { transactionId: razorpay_order_id },
        data: {
          status: 'COMPLETED',
          method: 'online',
        },
      });

      // Update order status
      if (orderId) {
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order confirmed',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
