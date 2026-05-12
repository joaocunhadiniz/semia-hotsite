import { useState, useRef, useEffect } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import SemiaBox from './SemiaBox'

interface Props { lang: Lang }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0',
  background: 'none', border: 'none',
  borderBottom: '1px solid var(--border)',
  fontFamily: 'var(--font-body)', fontSize: '0.9rem',
  color: 'var(--text)', outline: 'none',
  transition: 'border-color 0.2s',
}

export default function Registration({ lang }: Props) {
  const [form, setForm] = useState({ name: '', email: '', institution: '', role: '', modality: 'presencial' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [glitch, setGlitch]       = useState({ x: 0, y: 0 })
  const glitchRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tr = t.registration

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSubmitted(true) }, 1000)
  }

  const onHoverEnter = () => {
    glitchRef.current = setInterval(() => {
      setGlitch({ x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 })
    }, 50)
  }

  const onHoverLeave = () => {
    if (glitchRef.current) clearInterval(glitchRef.current)
    setGlitch({ x: 0, y: 0 })
  }

  useEffect(() => () => {
    if (glitchRef.current) clearInterval(glitchRef.current)
  }, [])

  return (
    <section id="register" style={{
      maxWidth: 900, margin: '0 auto', padding: '0 2rem 7rem',
      position: 'relative', zIndex: 1,
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', textTransform: 'uppercase', margin: 0, marginBottom: '1rem' }}>{tr.label[lang]}</p>

      <SemiaBox style={{ padding: '2.5rem' }}>
        {submitted ? (
          <p style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: '1.1rem', color: 'var(--accent)',
          }}>
            {tr.success[lang]}
          </p>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="label" style={{ fontSize: '0.62rem' }}>{tr.name[lang]}</span>
              <input name="name" required value={form.name} onChange={onChange}
                style={inputStyle}
                onFocus={e => { e.target.style.borderBottomColor = 'var(--accent)' }}
                onBlur={e  => { e.target.style.borderBottomColor = 'var(--border)' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="label" style={{ fontSize: '0.62rem' }}>{tr.email[lang]}</span>
              <input name="email" type="email" required value={form.email} onChange={onChange}
                style={inputStyle}
                onFocus={e => { e.target.style.borderBottomColor = 'var(--accent)' }}
                onBlur={e  => { e.target.style.borderBottomColor = 'var(--border)' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="label" style={{ fontSize: '0.62rem' }}>{tr.institution[lang]}</span>
              <input name="institution" value={form.institution} onChange={onChange}
                style={inputStyle}
                onFocus={e => { e.target.style.borderBottomColor = 'var(--accent)' }}
                onBlur={e  => { e.target.style.borderBottomColor = 'var(--border)' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <span className="label" style={{ fontSize: '0.62rem' }}>{tr.role[lang]}</span>
              <select name="role" required value={form.role} onChange={onChange}
                style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }}>
                {tr.roles[lang].map((r: string, i: number) => (
                  <option key={i} value={i === 0 ? '' : r} disabled={i === 0}>{r}</option>
                ))}
              </select>
            </label>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <span className="label" style={{ fontSize: '0.62rem' }}>{tr.modality[lang]}</span>
              <div style={{ display: 'flex', gap: '2.5rem' }}>
                {(['presencial', 'remoto'] as const).map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                    <input type="radio" name="modality" value={m} checked={form.modality === m}
                      onChange={onChange} style={{ accentColor: 'var(--accent)' }} />
                    <span style={{ fontSize: '0.88rem', color: 'var(--text)' }}>
                      {m === 'presencial' ? tr.inPerson[lang] : tr.remote[lang]}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              onMouseEnter={onHoverEnter}
              onMouseLeave={onHoverLeave}
              style={{
                marginTop: '0.5rem',
                alignSelf: 'flex-start',
                fontFamily: "'JetBrains Mono', 'Space Mono', monospace",
                fontSize: '0.72rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                background: '#0f0e0b',
                color: '#f5f3ee',
                border: 'none',
                padding: '0.75rem 2rem',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transform: `translate(${glitch.x}px, ${glitch.y}px)`,
                transition: 'opacity 0.2s',
                userSelect: 'none',
              }}
            >
              {loading ? '...' : `[ ${tr.submit[lang]} ]`}
            </button>
          </form>
        )}
      </SemiaBox>
    </section>
  )
}
