import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPrisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !email) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Verify signature using HMAC-SHA256
    const secret = process.env.RAZORPAY_KEY_SECRET!
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // Payment verified — save to database
    const prisma = getPrisma()
    if (prisma) {
      await prisma.payment.create({
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          amount: 299,
          status: 'SUCCESS',
          email,
        },
      })
    }

    // TODO: Generate one-time Telegram invite link via Bot API and send via email
    // For now, return success — Telegram integration comes next

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified successfully',
    })
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
