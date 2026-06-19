'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { Button } from './ui/button'

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <Button onClick={handleSignOut} variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  )
}
