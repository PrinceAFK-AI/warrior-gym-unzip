'use client'

import Link from 'next/link'
import { ArrowLeft, Users, UserCheck } from 'lucide-react'
import { AppHeader } from '@/components/app-shell'
import { NoticeManager } from '@/components/admin/notice-manager'
import { MemberTable } from '@/components/admin/member-table'

export type AdminMember = {
  id: string
  email: string | null
  phone: string | null
  full_name: string | null
  role: string
  membership_status: string
  membership_expires_at: string | null
  joined_at: string | null
  checkedInToday: boolean
}

export function AdminView({
  members,
  latestNotice,
  checkedInCount,
}: {
  members: AdminMember[]
  latestNotice: { content: string; created_at: string } | null
  checkedInCount: number
}) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-md pb-10">
      <AppHeader title="Admin Panel" subtitle="Warrior Gym" />

      <div className="flex flex-col gap-4 px-5 pt-5">
        <Link
          href="/dashboard"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs">Total Members</span>
            </div>
            <p className="mt-2 text-3xl font-bold leading-none text-foreground">
              {members.length}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/40 bg-primary/10 p-4">
            <div className="flex items-center gap-1.5 text-primary">
              <UserCheck className="h-4 w-4" />
              <span className="text-xs">Checked In Today</span>
            </div>
            <p className="mt-2 text-3xl font-bold leading-none text-primary">
              {checkedInCount}
            </p>
          </div>
        </div>

        <NoticeManager latestNotice={latestNotice} />

        <MemberTable members={members} />
      </div>
    </div>
  )
}
