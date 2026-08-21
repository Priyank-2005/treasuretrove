import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyWebhookSignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    console.log(`[Razorpay Webhook] ${eventType}`);

    switch (eventType) {
      case 'payment.captured': {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        // Update payment status
        await prisma.$transaction(async (tx) => {
          const paymentRecord = await tx.payment.findFirst({
            where: { transactionId: razorpayOrderId },
          });

          if (paymentRecord) {
            await tx.payment.update({
              where: { id: paymentRecord.id },
              data: {
                status: 'COMPLETED',
                method: payment.method || 'online',
              },
            });

            // Confirm the order
            await tx.order.update({
              where: { id: paymentRecord.orderId },
              data: { status: 'CONFIRMED' },
            });
          }
        });

        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment.entity;
        const razorpayOrderId = payment.order_id;

        await prisma.payment.updateMany({
          where: { transactionId: razorpayOrderId },
          data: { status: 'FAILED' },
        });

        break;
      }

      case 'refund.processed': {
        const refund = event.payload.refund.entity;
        const paymentId = refund.payment_id;

        // Find the payment by looking up the Razorpay payment ID in notes or transaction
        console.log(`[Razorpay Webhook] Refund processed for payment: ${paymentId}`);
        break;
      }

      default:
        console.log(`[Razorpay Webhook] Unhandled event: ${eventType}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent Razorpay from retrying
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}
