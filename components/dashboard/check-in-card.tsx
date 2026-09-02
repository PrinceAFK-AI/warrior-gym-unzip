'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function CheckInCard({
  initialCheckedIn,
  userId,
}: {
  initialCheckedIn: boolean
  userId: string
}) {
  const supabase = createClient()
  const [checkedIn, setCheckedIn] = useState(initialCheckedIn)
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState<string | null>(null)

  async function checkIn() {
    if (checkedIn || loading) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('attendance')
        .insert({ user_id: userId })
      if (error) throw error
      setCheckedIn(true)
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      )
      toast.success("Checked in. Let's get to work.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Check-in failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Daily Attendance
      </p>
      <button
        onClick={checkIn}
        disabled={checkedIn || loading}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-base font-bold uppercase tracking-wide transition-all ${
          checkedIn
            ? 'cursor-default bg-primary/15 text-primary ring-1 ring-primary/40'
            : 'bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.99]'
        }`}
      >
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : checkedIn ? (
          <CheckCircle2 className="h-5 w-5" />
        ) : (
          <Zap className="h-5 w-5" strokeWidth={2.5} />
        )}
        {checkedIn ? 'Checked In Today' : 'Check-In Today'}
      </button>
      {checkedIn && time && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Logged at {time}
        </p>
      )}
    </div>
  )
}
