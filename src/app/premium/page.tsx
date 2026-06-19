import Script from 'next/script'
import { Check, Star, Zap, Clock, Users, ShieldCheck, Send, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { PremiumCheckout } from '@/components/PremiumCheckout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Premium Telegram Group | Off Campus Jobs India',
  description: 'Join our exclusive Premium Telegram group. 50+ daily jobs, 15+ platforms, alerts within 30 minutes. One-time payment, lifetime access.',
}

export default function PremiumPage() {
  const stats = [
    { value: '50+', label: 'Jobs Daily' },
    { value: '15+', label: 'Platforms' },
    { value: '30min', label: 'Early Access' },
    { value: '₹299', label: 'One-Time' },
  ]

  const features = [
    {
      icon: Clock,
      title: 'Alerts Within 30 Minutes',
      description: 'We scan 15+ platforms every hour and deliver curated jobs to your Telegram within 30 minutes of posting.',
    },
    {
      icon: Zap,
      title: '50+ Jobs Posted Daily',
      description: 'Never miss an opportunity. We post 50+ verified fresher jobs every single day — no gaps, no breaks.',
    },
    {
      icon: Users,
      title: 'Direct HR Contacts & Referrals',
      description: 'Get employee referral links and direct HR email IDs that are never shared on the free channel.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Curated',
      description: 'Every job is manually verified — no spam, no duplicates, no expired links.',
    },
  ]

  const benefits = [
    '50+ fresh jobs posted daily with no gaps',
    'Alerts within 30 minutes of job posting',
    'Jobs sourced from 15+ hiring platforms',
    '48-hour early access before public posting',
    'Exclusive jobs not posted anywhere else',
    'Direct HR emails & employee referral portals',
    'Small, focused community — no spam',
    'Lifetime access with one-time payment',
  ]

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <main className="mx-auto max-w-5xl px-4 py-16">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border bg-yellow-50 px-4 py-1.5 text-sm font-semibold text-yellow-800">
            <Star className="h-4 w-4" />
            PREMIUM TELEGRAM GROUP
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Apply First.<br />
            <span className="text-primary">Get More Interview Calls.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            We scan 15+ platforms every hour and deliver curated fresher jobs to your Telegram — within 30 minutes of posting. Pay once, get jobs forever.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border bg-card p-5 text-center shadow-sm">
              <p className="text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Pricing + Checkout Card */}
        <div className="mb-16 mx-auto max-w-lg overflow-hidden rounded-2xl border bg-card shadow-lg">
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 text-center">
            <h2 className="text-2xl font-bold">Lifetime Access</h2>
            <div className="mt-4 flex items-center justify-center gap-1">
              <span className="text-4xl font-extrabold">₹299</span>
              <span className="text-muted-foreground">/ one-time</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">No recurring fees • Cancel-free forever</p>
          </div>
          <div className="p-8">
            <ul className="mb-8 space-y-3">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            <PremiumCheckout />
          </div>
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

        {/* Social Proof */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> 5,000+ freshers community
          </span>
          <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground" />
          <span className="flex items-center gap-1.5">
            <Send className="h-4 w-4" /> Active on Telegram
          </span>
          <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground" />
          <span>Since 2024</span>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-2xl">
          <h2 className="mb-6 text-center text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How does this work?',
                a: 'After payment, you\'ll receive a one-time Telegram invite link on your email. Click it to join the private premium group instantly. The link works only once for security.',
              },
              {
                q: 'Is this a one-time payment?',
                a: 'Yes! Pay ₹299 once and get lifetime access. No monthly or yearly renewals.',
              },
              {
                q: 'How is this different from the free Telegram channel?',
                a: 'Premium members get 50+ jobs daily (vs 10-15 on free), alerts within 30 minutes, exclusive hidden listings, direct HR contacts, and employee referral links.',
              },
              {
                q: 'What if I don\'t receive the invite link?',
                a: 'Check your spam/junk folder first. If you still don\'t see it within 10 minutes, contact us and we\'ll resend it immediately.',
              },
              {
                q: 'Can I get a refund?',
                a: 'Since access is granted instantly, we don\'t offer refunds. However, if you\'re not satisfied within 7 days, reach out and we\'ll work something out.',
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
            Contact Us <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </main>
    </>
  )
}
