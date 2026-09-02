'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Dumbbell, Loader2, Mail, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type EmailMode = 'signin' | 'signup'

export function AuthScreen() {
  const router = useRouter()
  const supabase = createClient()

  // Email/password state
  const [emailMode, setEmailMode] = useState<EmailMode>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)

  // Phone OTP state
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setEmailLoading(true)
    try {
      if (emailMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
              `${window.location.origin}/auth/callback`,
            data: { full_name: fullName },
          },
        })
        if (error) throw error
        toast.success('Account created. Check your email to confirm, then sign in.')
        setEmailMode('signin')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          if (error.message.toLowerCase().includes('email not confirmed')) {
            toast.error('Please confirm your email before signing in.')
          } else if (error.message.toLowerCase().includes('invalid')) {
            toast.error('Invalid email or password.')
          } else {
            toast.error(error.message)
          }
          return
        }
        toast.success('Welcome back, warrior.')
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setEmailLoading(false)
    }
  }

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault()
    setPhoneLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone })
      if (error) throw error
      setOtpSent(true)
      toast.success('Verification code sent to your phone.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not send code.')
    } finally {
      setPhoneLoading(false)
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setPhoneLoading(true)
    try {
      const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
      if (error) throw error
      toast.success('Welcome back, warrior.')
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invalid code.')
    } finally {
      setPhoneLoading(false)
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/30">
            <Dumbbell className="h-8 w-8 text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="font-mono text-3xl font-bold uppercase tracking-widest text-foreground">
            Warrior Gym
          </h1>
          <p className="mt-2 text-sm text-muted-foreground text-balance">
            Train hard. Track everything.
          </p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card">
            <TabsTrigger value="email" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Mail className="h-4 w-4" /> Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Phone className="h-4 w-4" /> Phone
            </TabsTrigger>
          </TabsList>

          {/* EMAIL / PASSWORD */}
          <TabsContent value="email" className="mt-6">
            <form onSubmit={handleEmail} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
              {emailMode === 'signup' && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Warrior"
                    required
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" disabled={emailLoading} className="mt-1 w-full font-semibold">
                {emailLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {emailMode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
              <button
                type="button"
                onClick={() => setEmailMode(emailMode === 'signin' ? 'signup' : 'signin')}
                className="text-center text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {emailMode === 'signin'
                  ? "New here? Create an account"
                  : 'Already a member? Sign in'}
              </button>
            </form>
          </TabsContent>

          {/* PHONE OTP */}
          <TabsContent value="phone" className="mt-6">
            {!otpSent ? (
              <form onSubmit={sendOtp} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+15551234567"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include your country code, e.g. +1.
                  </p>
                </div>
                <Button type="submit" disabled={phoneLoading} className="w-full font-semibold">
                  {phoneLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Send Code
                </Button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="otp">Verification code</Label>
                  <Input
                    id="otp"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Sent to {phone}.
                  </p>
                </div>
                <Button type="submit" disabled={phoneLoading} className="w-full font-semibold">
                  {phoneLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Verify & Sign In
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false)
                    setOtp('')
                  }}
                  className="text-center text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  Use a different number
                </button>
              </form>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
