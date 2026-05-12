import type { Lang } from '../lib/i18n'

interface Props { lang: Lang }

export default function Hero({ lang }: Props) {
  return (
    <section id="top" style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '0 2rem 2.5rem',
      position: 'relative',
      zIndex: 1,
    }}>
      <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>

        {/* Label */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
          fontWeight: 400,
          color: 'var(--text)',
          letterSpacing: '0.06em',
          margin: 0,
        }}>
          sem<span style={{ color: 'var(--text)' }}>IA</span> II
        </p>

        {/* Big title — 3 lines */}
        <div style={{ margin: 0 }}>
          {(lang === 'pt'
            ? ['POR UMA', 'SEMIÓTICA', 'RIZOSSOMÁTICA']
            : ['TOWARDS A', 'RHIZOSOMATIC', 'SEMIOTICS']
          ).map((line, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.0,
              wordSpacing: i === 0 ? '-0.3em' : 'normal',
            }}>
              {line}
            </p>
          ))}
        </div>

        {/* Keywords */}
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.75rem, 1.1vw, 0.92rem)',
          color: 'var(--text-dim)',
          letterSpacing: '0.06em',
          margin: 0,
          opacity: 0.6,
        }}>
          {lang === 'pt'
            ? 'Soberania de IA | Decolonial Computing | Multilateralismo Epistêmico'
            : 'AI Sovereignty | Decolonial Computing | Epistemic Multilateralism'}
        </p>

        {/* Meta chips */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            lang === 'pt' ? '30 de novembro de 2026' : 'November 30, 2026',
            lang === 'pt' ? 'ECA — Universidade de São Paulo' : 'ECA — University of São Paulo',
          ].map(label => (
            <span key={label} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--text-dim)',
              border: '1px solid var(--border)',
              padding: '4px 11px',
              opacity: 0.7,
            }}>
              {label}
            </span>
          ))}
          <a href="#register" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.06em',
            color: 'var(--accent)',
            textDecoration: 'none',
            border: '1px solid var(--accent)',
            padding: '4px 11px',
          }}>
            {lang === 'pt' ? 'Inscreva-se' : 'Register'} →
          </a>
        </div>

      </div>
    </section>
  )
}
