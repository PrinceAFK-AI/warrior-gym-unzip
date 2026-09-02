'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Dumbbell, Loader2, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SPLITS, formatDate, type WorkoutSplit } from '@/lib/gym'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type WorkoutLog = {
  id: string
  split: string
  exercise: string
  sets: number | null
  reps: number | null
  weight: number | null
  logged_at: string
}

export function WorkoutLogger({
  userId,
  initialLogs,
}: {
  userId: string
  initialLogs: WorkoutLog[]
}) {
  const supabase = createClient()
  const [logs, setLogs] = useState<WorkoutLog[]>(initialLogs)
  const [split, setSplit] = useState<WorkoutSplit>('Push')
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [loading, setLoading] = useState(false)

  async function logExercise(e: React.FormEvent) {
    e.preventDefault()
    if (!exercise.trim()) {
      toast.error('Enter an exercise name.')
      return
    }
    setLoading(true)
    const row = {
      user_id: userId,
      split,
      exercise: exercise.trim(),
      sets: sets ? Number(sets) : null,
      reps: reps ? Number(reps) : null,
      weight: weight ? Number(weight) : null,
    }
    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .insert(row)
        .select('id, split, exercise, sets, reps, weight, logged_at')
        .single()
      if (error) throw error
      setLogs((prev) => [data as WorkoutLog, ...prev])
      setExercise('')
      setSets('')
      setReps('')
      setWeight('')
      toast.success('Exercise logged.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not log exercise.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Dumbbell className="h-4 w-4 text-primary" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workout Logger
        </p>
      </div>

      {/* Split picker */}
      <div className="mt-4 flex flex-wrap gap-2">
        {SPLITS.map((s) => (
          <button
            key={s}
            onClick={() => setSplit(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
              split === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/60 text-muted-foreground hover:text-foreground'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Log form */}
      <form onSubmit={logExercise} className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="exercise" className="text-xs">Exercise</Label>
          <Input
            id="exercise"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Bench Press"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sets" className="text-xs">Sets</Label>
            <Input id="sets" type="number" inputMode="numeric" value={sets} onChange={(e) => setSets(e.target.value)} placeholder="4" min={0} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reps" className="text-xs">Reps</Label>
            <Input id="reps" type="number" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="10" min={0} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="weight" className="text-xs">Kg</Label>
            <Input id="weight" type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="60" min={0} />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full font-semibold">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Log Exercise
        </Button>
      </form>

      {/* History */}
      {logs.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Logs
          </p>
          <ul className="flex flex-col gap-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between rounded-xl bg-background/60 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                      {log.split}
                    </span>
                    <span className="truncate text-sm font-medium text-foreground">
                      {log.exercise}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(log.logged_at)}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  {log.sets ?? '—'}×{log.reps ?? '—'}
                  {log.weight ? ` @ ${log.weight}kg` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
