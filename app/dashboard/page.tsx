import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/gym'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import { DeniedToast } from '@/components/dashboard/denied-toast'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'id, email, phone, full_name, role, height_cm, weight_kg, membership_status, membership_expires_at, joined_at',
    )
    .eq('id', user.id)
    .single()

  const { data: latestNotice } = await supabase
    .from('notices')
    .select('content, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { data: todayCheckIn } = await supabase
    .from('attendance')
    .select('id, checked_in_at')
    .eq('user_id', user.id)
    .gte('checked_in_at', startOfDay.toISOString())
    .order('checked_in_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const { data: workouts } = await supabase
    .from('workout_logs')
    .select('id, split, exercise, sets, reps, weight, logged_at')
    .eq('user_id', user.id)
    .order('logged_at', { ascending: false })
    .limit(20)

  return (
    <>
      <Suspense fallback={null}>
        <DeniedToast />
      </Suspense>
      <DashboardView
        profile={profile as Profile}
        isAdmin={profile?.role === 'admin'}
        latestNotice={latestNotice ?? null}
        checkedInToday={!!todayCheckIn}
        workouts={workouts ?? []}
      />
    </>
  )
}
