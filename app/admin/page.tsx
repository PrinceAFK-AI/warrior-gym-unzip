import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/gym'
import { AdminView, type AdminMember } from '@/components/admin/admin-view'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Server-side RBAC: read role from profiles.
  const { data: me } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Block rendering and redirect non-admins. Toast is triggered on /dashboard.
  if (me?.role !== 'admin') {
    redirect('/dashboard?denied=1')
  }

  const { data: members } = await supabase
    .from('profiles')
    .select(
      'id, email, phone, full_name, role, membership_status, membership_expires_at, joined_at',
    )
    .order('joined_at', { ascending: false })

  const startOfDay = new Date()
  startOfDay.setHours(0, 0, 0, 0)

  const { data: todayAttendance } = await supabase
    .from('attendance')
    .select('user_id, checked_in_at')
    .gte('checked_in_at', startOfDay.toISOString())

  const checkedInIds = new Set((todayAttendance ?? []).map((a) => a.user_id))

  const enriched: AdminMember[] = (members ?? []).map((m: Partial<Profile>) => ({
    id: m.id!,
    email: m.email ?? null,
    phone: m.phone ?? null,
    full_name: m.full_name ?? null,
    role: m.role ?? 'member',
    membership_status: m.membership_status ?? 'Active',
    membership_expires_at: m.membership_expires_at ?? null,
    joined_at: m.joined_at ?? null,
    checkedInToday: checkedInIds.has(m.id!),
  }))

  const { data: latestNotice } = await supabase
    .from('notices')
    .select('content, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <AdminView
      members={enriched}
      latestNotice={latestNotice ?? null}
      checkedInCount={checkedInIds.size}
    />
  )
}
