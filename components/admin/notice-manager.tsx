'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Megaphone, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/gym'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function NoticeManager({
  latestNotice,
}: {
  latestNotice: { content: string; created_at: string } | null
}) {
  const supabase = createClient()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(latestNotice)

  async function publish(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Write a notice first.')
      return
    }
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('notices')
        .insert({ content: content.trim(), published_by: user?.id })
        .select('content, created_at')
        .single()
      if (error) throw error
      setCurrent(data)
      setContent('')
      toast.success('Notice published to all members.')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not publish notice.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Notice Board Manager
        </p>
      </div>

      {current && (
        <div className="mt-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Live Now
          </p>
          <p className="mt-1 text-sm leading-relaxed text-foreground text-pretty">
            {current.content}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Posted {formatDate(current.created_at)}
          </p>
        </div>
      )}

      <form onSubmit={publish} className="mt-3 flex flex-col gap-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="e.g. Gym closes at 8 PM on Friday for maintenance."
          rows={3}
          className="resize-none"
        />
        <Button type="submit" disabled={loading} className="w-full font-semibold">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Publish Notice
        </Button>
      </form>
    </div>
  )
}
