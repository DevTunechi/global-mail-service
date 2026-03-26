'use client'

import { useState } from 'react'
import styles from './Composer.module.css'

interface ComposerProps {
  userRef: string; // 'u1' or 'u2'
}

export default function Composer({ userRef }: ComposerProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSend = async () => {
    setStatus('sending')
    
    // Split comma or newline separated emails into an array
    const recipients = to.split(/[\s,]+/).filter(email => email.includes('@'))

    try {
      const res = await fetch('/api/admin/send-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          subject,
          html: body,
          ref: userRef
        }),
      })

      if (res.ok) {
        setStatus('sent')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch (err) {
      alert("Mail delivery failed. Check Postmark settings.")
      setStatus('idle')
    }
  }

  if (!isOpen) return (
    <button className={styles.minimizedTab} onClick={() => setIsOpen(true)}>
      New Message
    </button>
  )

  return (
    <div className={styles.composerWindow}>
      <div className={styles.header}>
        <span>New Message (via {userRef.toUpperCase()})</span>
        <div className={styles.controls}>
          <button onClick={() => setIsOpen(false)}>×</button>
        </div>
      </div>

      <div className={styles.inputArea}>
        <input 
          placeholder="Recipients (comma separated)" 
          value={to} 
          onChange={(e) => setTo(e.target.value)}
        />
        <input 
          placeholder="Subject" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <textarea 
        className={styles.body} 
        placeholder="Paste your HTML template here..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className={styles.footer}>
        <button 
          className={styles.sendBtn} 
          onClick={handleSend}
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send'}
        </button>
        <span className={styles.noReplyTag}>From: noreply@swtchmail.live</span>
      </div>
    </div>
  )
}