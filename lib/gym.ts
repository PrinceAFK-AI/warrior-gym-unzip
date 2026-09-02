export type Profile = {
  id: string
  email: string | null
  phone: string | null
  full_name: string | null
  role: string
  height_cm: number | null
  weight_kg: number | null
  membership_status: string
  membership_expires_at: string | null
  joined_at: string
}

export type WorkoutSplit = 'Push' | 'Pull' | 'Legs' | 'Arms' | 'Cardio'

export const SPLITS: WorkoutSplit[] = ['Push', 'Pull', 'Legs', 'Arms', 'Cardio']

export function calcBmi(heightCm: number | null, weightKg: number | null): number | null {
  if (!heightCm || !weightKg || heightCm <= 0) return null
  const m = heightCm / 100
  return Math.round((weightKg / (m * m)) * 10) / 10
}

export function bmiCategory(bmi: number | null): string {
  if (bmi === null) return 'No data'
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Healthy'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function membershipTone(status: string): string {
  switch (status) {
    case 'Active':
      return 'text-primary'
    case 'Expiring Soon':
      return 'text-yellow-400'
    default:
      return 'text-destructive'
  }
}

export function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function isToday(iso: string): boolean {
  const d = new Date(iso)
  const now = new Date()
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  )
}
