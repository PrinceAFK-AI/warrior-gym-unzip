'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function DeniedToast() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const fired = useRef(false)

  useEffect(() => {
    if (params.get('denied') === '1' && !fired.current) {
      fired.current = true
      toast.error('Access Denied: Admin privileges required.')
      router.replace(pathname)
    }
  }, [params, router, pathname])

  return null
}
