'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'



interface PremiumCheckoutProps {
  onSuccess?: () => void
}

export function PremiumCheckout({ onSuccess }: PremiumCheckoutProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handlePayment = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Create order
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!orderRes.ok) {
        throw new Error('Failed to create order')
      }

      const { order_id, amount, currency } = await orderRes.json()

      // Step 2: Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Off Campus Jobs India',
        description: 'Premium Telegram Group — Lifetime Access',
        order_id,
        prefill: {
          email,
        },
        theme: {
          color: '#18181b',
        },
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          // Step 3: Verify payment
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email,
              }),
            })

            if (verifyRes.ok) {
              setSuccess(true)
              onSuccess?.()
            } else {
              setError('Payment verification failed. Please contact support.')
            }
          } catch {
            setError('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      setLoading(false)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <span className="text-2xl">🎉</span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-green-800">Payment Successful!</h3>
        <p className="text-sm text-green-700">
          Your Premium Telegram group invite link will be sent to <strong>{email}</strong> shortly.
          Check your inbox (and spam folder) within the next few minutes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="premium-email" className="mb-2 block text-sm font-medium">
          Your email address
        </label>
        <input
          id="premium-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError('') }}
          className="w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          The Telegram invite link will be sent to this email after payment.
        </p>
      </div>

      {error && (
        <p className="text-sm font-medium text-red-600">{error}</p>
      )}

      <Button
        onClick={handlePayment}
        disabled={loading}
        size="lg"
        className="w-full text-base"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay ₹299 — Get Lifetime Access →'
        )}
      </Button>
    </div>
  )
}
