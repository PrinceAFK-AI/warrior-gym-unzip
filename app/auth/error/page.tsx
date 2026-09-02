import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/30">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mt-6 font-mono text-2xl font-bold uppercase tracking-wide">
        Authentication Failed
      </h1>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground text-pretty">
        We couldn&apos;t verify your session. Please try signing in again.
      </p>
      <Button asChild className="mt-6 font-semibold">
        <Link href="/auth/login">Back to Login</Link>
      </Button>
    </main>
  )
}
