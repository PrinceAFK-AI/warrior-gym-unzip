import { Megaphone } from 'lucide-react'
import { formatDate } from '@/lib/gym'

export function NoticeBanner({
  notice,
}: {
  notice: { content: string; created_at: string } | null
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15">
          <Megaphone className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Notice Board
          </p>
          {notice ? (
            <>
              <p className="mt-1 text-sm leading-relaxed text-foreground text-pretty">
                {notice.content}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Posted {formatDate(notice.created_at)}
              </p>
            </>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              No announcements right now. Check back later.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
