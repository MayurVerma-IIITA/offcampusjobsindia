'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    setLoading(true)
    const res = await loadRazorpayScript()

    if (!res) {
      alert('Razorpay SDK failed to load. Are you offline?')
      setLoading(false)
      return
    }

    try {
      const orderRes = await fetch('/api/razorpay/create-order', { method: 'POST' })
      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order')
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Off Campus Jobs India',
        description: 'Premium Lifetime Access',
        order_id: orderData.orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
              alert('Payment successful! Welcome to Premium.')
              router.push('/jobs')
              router.refresh()
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          } catch (err) {
            console.error(err)
            alert('Something went wrong during verification.')
          }
        },
        theme: {
          color: '#0f172a', // Tailwind slate-900 or primary
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} size="lg" className="w-full sm:w-auto">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Pay ₹299 for Lifetime Access
    </Button>
  )
}
