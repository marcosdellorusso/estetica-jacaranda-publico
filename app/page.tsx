'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function RootRedirect() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/inicio')
    } else if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [router, status])

  return null
}