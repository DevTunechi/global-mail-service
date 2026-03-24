// src/app/login/page.tsx
import LoginCard from '@/components/LoginCard'

export const metadata = {
  title: 'Sign In — Global Mail Service',
}

export default function LoginPage() {
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
      <LoginCard />
    </main>
  )
}
