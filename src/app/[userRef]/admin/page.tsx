// src/app/[userRef]/admin/page.tsx
import Composer from '@/components/Composer'
import { notFound } from 'next/navigation'

export default function AdminPage({ params }: { params: { userRef: string } }) {
  const { userRef } = params

  // Security: Only allow u1 and u2 to access these routes
  const allowedUsers = ['u1', 'u2']
  if (!allowedUsers.includes(userRef)) {
    notFound()
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f1f3f4', 
      padding: '40px',
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', color: '#202124' }}>
            SwitchMail Admin Console
          </h1>
          <p style={{ color: '#5f6368' }}>
            Managing outgoing mail for: <strong>{userRef.toUpperCase()}</strong>
          </p>
        </header>

        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)' 
        }}>
          <h3>Email Campaign Instructions</h3>
          <ul style={{ color: '#5f6368', lineHeight: '1.6' }}>
            <li>Paste your target email list into the "Recipients" box.</li>
            <li>Ensure your HTML template contains your tracking link.</li>
            <li>All emails will be sent via <strong>noreply@swtchmail.live</strong>.</li>
          </ul>
          
          <p style={{ marginTop: '20px', fontStyle: 'italic', fontSize: '13px' }}>
            Click "New Message" in the bottom right to begin.
          </p>
        </div>

        {/* This is the Gmail-style Composer we built earlier */}
        <Composer userRef={userRef} />
      </div>
    </main>
  )
}