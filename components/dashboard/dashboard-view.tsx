'use client'

import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import type { Profile } from '@/lib/gym'
import { AppHeader } from '@/components/app-shell'
import { NoticeBanner } from '@/components/dashboard/notice-banner'
import { MetricsCard } from '@/components/dashboard/metrics-card'
import { CheckInCard } from '@/components/dashboard/check-in-card'
import { MembershipCard } from '@/components/dashboard/membership-card'
import { WorkoutLogger, type WorkoutLog } from '@/components/dashboard/workout-logger'

export function DashboardView({
  profile,
  isAdmin,
  latestNotice,
  checkedInToday,
  workouts,
}: {
  profile: Profile
  isAdmin: boolean
  latestNotice: { content: string; created_at: string } | null
  checkedInToday: boolean
  workouts: WorkoutLog[]
}) {
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Warrior'

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md pb-10">
      <AppHeader title="Warrior Gym" subtitle={`Welcome, ${firstName}`} />

      <div className="flex flex-col gap-4 px-5 pt-5">
        <NoticeBanner notice={latestNotice} />

        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 transition-colors hover:bg-primary/15"
          >
            <span className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              Open Admin Dashboard
            </span>
            <span className="text-xs text-primary/70">Manage members</span>
          </Link>
        )}

        <MembershipCard
          status={profile?.membership_status ?? 'Active'}
          expiresAt={profile?.membership_expires_at ?? null}
          joinedAt={profile?.joined_at ?? null}
        />

        <CheckInCard initialCheckedIn={checkedInToday} userId={profile.id} />

        <MetricsCard
          userId={profile.id}
          heightCm={profile?.height_cm ?? null}
          weightKg={profile?.weight_kg ?? null}
        />

        <WorkoutLogger userId={profile.id} initialLogs={workouts} />
      </div>
    </div>
  )
}
