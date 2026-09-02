'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Activity, Loader2, Pencil, Ruler, Weight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { calcBmi, bmiCategory } from '@/lib/gym'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function MetricsCard({
  userId,
  heightCm,
  weightKg,
}: {
  userId: string
  heightCm: number | null
  weightKg: number | null
}) {
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState(heightCm)
  const [weight, setWeight] = useState(weightKg)
  const [draftHeight, setDraftHeight] = useState(heightCm?.toString() ?? '')
  const [draftWeight, setDraftWeight] = useState(weightKg?.toString() ?? '')

  const bmi = calcBmi(height, weight)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const h = draftHeight ? Number(draftHeight) : null
    const w = draftWeight ? Number(draftWeight) : null
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ height_cm: h, weight_kg: w })
        .eq('id', userId)
      if (error) throw error
      setHeight(h)
      setWeight(w)
      setOpen(false)
      toast.success('Metrics updated.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Personal Metrics
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Edit Metrics</DialogTitle>
              <DialogDescription>
                Update your height and weight. BMI recalculates automatically.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={save} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  inputMode="decimal"
                  value={draftHeight}
                  onChange={(e) => setDraftHeight(e.target.value)}
                  placeholder="175"
                  min={50}
                  max={260}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  value={draftWeight}
                  onChange={(e) => setDraftWeight(e.target.value)}
                  placeholder="70"
                  min={20}
                  max={400}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full font-semibold">
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Metrics
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat icon={<Ruler className="h-4 w-4" />} label="Height" value={height ? `${height}` : '—'} unit="cm" />
        <Stat icon={<Weight className="h-4 w-4" />} label="Weight" value={weight ? `${weight}` : '—'} unit="kg" />
        <Stat
          icon={<Activity className="h-4 w-4" />}
          label="BMI"
          value={bmi !== null ? `${bmi}` : '—'}
          unit={bmi !== null ? bmiCategory(bmi) : ''}
          highlight
        />
      </div>
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
  unit,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-xl bg-background/60 p-3">
      <div className={`flex items-center gap-1 ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-1.5 text-xl font-bold leading-none text-foreground">{value}</p>
      <p className={`mt-1 text-xs ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>{unit}</p>
    </div>
  )
}
