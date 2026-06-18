'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from './ui/button'
import { LogIn } from 'lucide-react'

export function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Button onClick={handleLogin} variant="outline" className="gap-2">
      <LogIn className="h-4 w-4" />
      Sign in
    </Button>
  )
}
