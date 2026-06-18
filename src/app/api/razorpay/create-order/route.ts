import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'
import { getPrisma } from '@/lib/prisma'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prisma = getPrisma()!
    const member = await prisma.member.findUnique({
      where: { id: user.id }
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    if (member.isPremium) {
      return NextResponse.json({ error: 'Already premium' }, { status: 400 })
    }

    const amount = 29900 // ₹299.00 in paise
    const currency = 'INR'

    const options = {
      amount,
      currency,
      receipt: `receipt_${user.id.substring(0, 8)}_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)

    // Store pending payment in DB
    await prisma.payment.create({
      data: {
        memberId: user.id,
        orderId: order.id,
        amount: amount,
        status: 'PENDING',
      }
    })

    return NextResponse.json({ orderId: order.id, amount, currency })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
