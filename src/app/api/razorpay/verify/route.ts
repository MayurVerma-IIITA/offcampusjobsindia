import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { getPrisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    const prisma = getPrisma()!

    if (generated_signature !== razorpay_signature) {
      // Record failure if we can find the payment
      await prisma.payment.updateMany({
        where: { orderId: razorpay_order_id, memberId: user.id },
        data: { status: 'FAILED' }
      })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Update payment as success
    const payment = await prisma.payment.updateMany({
      where: { orderId: razorpay_order_id, memberId: user.id },
      data: {
        paymentId: razorpay_payment_id,
        status: 'SUCCESS'
      }
    })

    if (payment.count === 0) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 })
    }

    // Upgrade user to premium
    await prisma.member.update({
      where: { id: user.id },
      data: { isPremium: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
