import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const amount = 29900 // ₹299 in paise
    const currency = 'INR'
    const receipt = `premium_${Date.now()}`

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      notes: {
        email,
        purpose: 'premium_telegram_access',
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
