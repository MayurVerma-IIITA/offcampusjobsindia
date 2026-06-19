import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { getPrisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Generate one-time Telegram invite link
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_GROUP_CHAT_ID

    let inviteLink = 'Error generating link. Please contact support.'
    
    if (botToken && chatId) {
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/createChatInviteLink`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            name: `Invite for ${email}`,
            member_limit: 1, // Single use only
          }),
        })
        const tgData = await tgRes.json()
        if (tgData.ok && tgData.result.invite_link) {
          inviteLink = tgData.result.invite_link
        } else {
          console.error('Telegram API error:', tgData)
        }
      } catch (err) {
        console.error('Failed to call Telegram API:', err)
      }
    } else {
      console.error('Missing Telegram environment variables')
    }

    // Send Email using Resend
    try {
      await resend.emails.send({
        from: 'Off Campus Jobs India <onboarding@resend.dev>', // Change to your verified domain later (e.g., updates@offcampusjobsindia.com)
        to: email,
        subject: '🎉 Your Premium Telegram Group Invite is Here!',
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
            <h2 style="color: #ca8a04;">Welcome to Premium!</h2>
            <p>Thank you for purchasing lifetime access to the Premium Telegram Group.</p>
            <p>Click the link below to join immediately. <strong>This link is unique to you and will expire as soon as you join. Do not share it!</strong></p>
            
            <div style="margin: 30px 0;">
              <a href="${inviteLink}" style="background-color: #ca8a04; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Join Premium Telegram Group Now
              </a>
            </div>

            <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this URL into your browser:<br/>${inviteLink}</p>
            <hr style="border: 1px solid #eee; margin: 30px 0;" />
            <p style="color: #999; font-size: 12px;">If you have any issues, please reply to this email.</p>
          </div>
        `,
      })
    } catch (err) {
      console.error('Failed to send email:', err)
      // We don't fail the request here so the user still sees the success screen
      // even if the email failed to send (you'd have to handle it manually)
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified and invite sent',
    })
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
