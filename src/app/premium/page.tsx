import { createClient } from '@/lib/supabase/server'
import { getPrisma } from '@/lib/prisma'
import { CheckoutButton } from '@/components/CheckoutButton'
import { LoginButton } from '@/components/LoginButton'
import { Check, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Membership | Off Campus Jobs India',
  description: 'Unlock early access to jobs, exclusive referrals, and an ad-free experience.',
}

export default async function PremiumPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  if (user) {
    const prisma = getPrisma()!
    const member = await prisma.member.findUnique({ where: { id: user.id } })
    isPremium = member?.isPremium || false
  }

  const features = [
    '48-Hour Early Access to top jobs before the public sees them',
    'Exclusive hidden jobs only posted for premium members',
    'Direct HR emails and employee referral portals',
    '100% Ad-free browsing experience',
    'Lifetime Access with a one-time payment'
  ]

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
        <Star className="h-8 w-8 text-yellow-600" />
      </div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
        Upgrade to <span className="text-yellow-600">Premium</span>
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
        Stop competing with thousands of free users. Get early access to the best off-campus drives and secure your dream job faster.
      </p>

      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border bg-card text-left shadow-lg">
        <div className="bg-muted p-8 text-center">
          <h2 className="text-2xl font-bold">Lifetime Access</h2>
          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="text-4xl font-extrabold">₹299</span>
            <span className="text-muted-foreground">/ one-time</span>
          </div>
        </div>
        <div className="p-8">
          <ul className="mb-8 space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-center gap-4">
            {isPremium ? (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-800 w-full">
                You are already a Premium Member! 🎉
              </div>
            ) : user ? (
              <CheckoutButton />
            ) : (
              <div className="w-full text-center">
                <p className="mb-4 text-sm text-muted-foreground">Sign in with Google to continue</p>
                <div className="flex justify-center"><LoginButton /></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
