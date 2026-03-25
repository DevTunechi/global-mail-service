// src/app/login/page.tsx
'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginCard from '@/components/LoginCard'

function LoginContent() {
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref') // Captures "u1" or "u2"

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      {/* Pass the ref down to the card so it can send it to the API */}
      <LoginCard referralId={ref} />
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}