'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Dumbbell, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AppHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  const router = useRouter()
  const supabase = createClient()

  async function logout() {
    await supabase.auth.signOut()
    toast.success('Signed out.')
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/90 px-5 py-4 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/30">
          <Dumbbell className="h-5 w-5 text-primary" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-mono text-sm font-bold uppercase leading-none tracking-widest text-foreground">
            {title}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <button
        onClick={logout}
        aria-label="Sign out"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </header>
  )
}
