'use client'

import { useMemo, useState } from 'react'
import { Mail, Phone, Search, ShieldCheck } from 'lucide-react'
import { formatDate } from '@/lib/gym'
import { Input } from '@/components/ui/input'
import type { AdminMember } from '@/components/admin/admin-view'

export function MemberTable({ members }: { members: AdminMember[] }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return members
    return members.filter((m) =>
      [m.full_name, m.email, m.phone]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q)),
    )
  }, [members, query])

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Member Management
        </p>
      </div>

      <div className="relative mt-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email or phone"
          className="pl-9"
        />
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {filtered.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            No members found.
          </li>
        )}
        {filtered.map((m) => (
          <li key={m.id} className="rounded-xl bg-background/60 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {m.full_name ?? 'Unnamed Member'}
                  </span>
                  {m.role === 'admin' && (
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                  )}
                </div>
                {m.email && (
                  <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <Mail className="h-3 w-3 shrink-0" />
                    {m.email}
                  </p>
                )}
                {m.phone && (
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 shrink-0" />
                    {m.phone}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  Joined {formatDate(m.joined_at)}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  m.checkedInToday
                    ? 'bg-primary/15 text-primary ring-1 ring-primary/40'
                    : 'bg-background text-muted-foreground ring-1 ring-border'
                }`}
              >
                {m.checkedInToday ? 'Present' : 'Absent'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
