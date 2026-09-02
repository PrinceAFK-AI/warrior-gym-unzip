import { BadgeCheck, CalendarClock, CalendarPlus } from 'lucide-react'
import { formatDate } from '@/lib/gym'

export function MembershipCard({
  status,
  expiresAt,
  joinedAt,
}: {
  status: string
  expiresAt: string | null
  joinedAt: string | null
}) {
  const isActive = status === 'Active'
  const isExpiring = status === 'Expiring Soon'

  const tone = isActive
    ? 'border-primary/40 bg-primary/10 text-primary'
    : isExpiring
      ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
      : 'border-destructive/40 bg-destructive/10 text-destructive'

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Membership
        </p>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}
        >
          <BadgeCheck className="h-3.5 w-3.5" />
          {status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-background/60 p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarPlus className="h-3.5 w-3.5" />
            <span className="text-xs">Joined</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatDate(joinedAt)}
          </p>
        </div>
        <div className="rounded-xl bg-background/60 p-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CalendarClock className="h-3.5 w-3.5" />
            <span className="text-xs">Expires</span>
          </div>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {formatDate(expiresAt)}
          </p>
        </div>
      </div>
    </div>
  )
}
