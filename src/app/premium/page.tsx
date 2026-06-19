import { Check, Star, Zap, Clock, Users, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Telegram Group | Off Campus Jobs India',
  description: 'Join our exclusive Premium Telegram group for early access to jobs, direct HR contacts, and referral links.',
}

export default function PremiumPage() {
  const premiumTelegramUrl = process.env.NEXT_PUBLIC_PREMIUM_TELEGRAM_URL || 'https://t.me/offcampusjobsindia_IT'

  const features = [
    {
      icon: Clock,
      title: '48-Hour Early Access',
      description: 'See top jobs 2 days before they go public on the website.',
    },
    {
      icon: Zap,
      title: 'Exclusive Hidden Jobs',
      description: 'Jobs that are never posted on the free channel or website.',
    },
    {
      icon: Users,
      title: 'Direct HR Contacts & Referrals',
      description: 'Get employee referral links and direct HR email IDs.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Curated',
      description: 'Every job is manually verified — no spam, no duplicates.',
    },
  ]

  const benefits = [
    '48-hour early access to all new jobs',
    'Exclusive jobs not posted anywhere else',
    'Direct HR emails & employee referral portals',
    'Curated daily job alerts in your Telegram',
    'Small, focused community — no spam',
    'Lifetime access with one-time payment',
  ]

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <Star className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
          Join the <span className="text-yellow-600">Premium</span> Telegram Group
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Stop competing with thousands of applicants. Get exclusive early access to the best off-campus drives and secure your dream job faster.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="mb-16 grid gap-6 sm:grid-cols-2">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Pricing Card */}
      <div className="mx-auto max-w-lg overflow-hidden rounded-2xl border bg-card shadow-lg">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 text-center">
          <h2 className="text-2xl font-bold">Premium Telegram Group</h2>
          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="text-4xl font-extrabold">₹299</span>
            <span className="text-muted-foreground">/ one-time</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Lifetime access • No recurring fees</p>
        </div>
        <div className="p-8">
          <ul className="mb-8 space-y-4">
            {benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="h-5 w-5 shrink-0 text-green-500" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <a
            href={premiumTelegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg" }), "w-full text-base")}
          >
            Join Premium Telegram Group →
          </a>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            You&apos;ll be redirected to Telegram. Payment instructions are shared in the group.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mx-auto mt-16 max-w-2xl">
        <h2 className="mb-6 text-center text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: 'How do I join the Premium group?',
              a: 'Click the "Join Premium Telegram Group" button above. You\'ll be redirected to Telegram where you can complete payment and get instant access.',
            },
            {
              q: 'Is this a one-time payment?',
              a: 'Yes! Pay once and get lifetime access. No monthly or yearly fees.',
            },
            {
              q: 'What makes Premium different from the free channel?',
              a: 'Premium members get jobs 48 hours early, exclusive hidden listings, direct HR contacts, and employee referral links that are never shared publicly.',
            },
            {
              q: 'Can I get a refund?',
              a: 'Since access is granted instantly, we do not offer refunds. However, if you\'re not satisfied within 7 days, reach out and we\'ll work something out.',
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-lg border bg-card p-5">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <p className="mb-4 text-muted-foreground">Still have questions?</p>
        <Link
          href="/contact"
          className={buttonVariants({ variant: "outline" })}
        >
          Contact Us
        </Link>
      </div>
    </main>
  )
}
