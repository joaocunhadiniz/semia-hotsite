import { useState, useEffect } from 'react'
import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'

interface Props { lang: Lang; setLang: (l: Lang) => void }

export default function Navbar({ lang, setLang }: Props) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { href: '#about',       label: t.nav.about[lang] },
    { href: '#speakers',    label: t.nav.speakers[lang] },
    { href: '#schedule',    label: t.nav.schedule[lang] },
    { href: '#roundtables', label: t.nav.roundtables[lang] },
    { href: '#register',    label: t.nav.register[lang] },
  ]

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'border-color 0.4s',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        background: scrolled ? 'rgba(245,243,238,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <nav style={{
        maxWidth: 900, margin: '0 auto', padding: '0 2rem',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="#top" style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.82rem',
          color: 'var(--text)', textDecoration: 'none', letterSpacing: '0.05em',
        }}>
          sem<span style={{ color: 'var(--accent)' }}>IA</span>
          <span style={{ color: 'var(--text-dim)', marginLeft: 3 }}>II</span>
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }}>
          {/* hide nav links on narrow viewport */}
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              fontFamily: 'var(--font-body)', fontSize: '0.8rem',
              color: 'var(--text-dim)', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
            >
              {l.label}
            </a>
          ))}

          <button
            onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              background: 'none', border: '1px solid var(--border)',
              color: 'var(--text-dim)', cursor: 'pointer',
              padding: '3px 10px', borderRadius: 2,
              letterSpacing: '0.1em',
            }}
          >
            {lang === 'pt' ? 'EN' : 'PT'}
          </button>
        </div>
      </nav>
    </header>
  )
}
