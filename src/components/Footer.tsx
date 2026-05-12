import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'

interface Props {
  lang: Lang
}

export default function Footer({ lang }: Props) {
  const tr = t.footer
  return (
    <footer style={{
      maxWidth: 900, margin: '0 auto', padding: '3rem 2rem 4rem',
      position: 'relative', zIndex: 1,
    }}>
      <div className="divider" style={{ marginBottom: '2.5rem' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
            sem<span style={{ color: 'var(--accent)' }}>IA</span>
            <span style={{ color: 'var(--text-dim)', marginLeft: 4, fontSize: '0.75rem' }}>II</span>
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{tr.group[lang]}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', opacity: 0.7, marginTop: 2 }}>{tr.groupSub[lang]}</p>
        </div>

        <div>
          <p className="label" style={{ marginBottom: '0.6rem', fontSize: '0.6rem' }}>{tr.hosted[lang]}</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text)', marginBottom: '0.2rem' }}>
            ECA — Escola de Comunicações e Artes
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Universidade de São Paulo</p>
        </div>

        <div>
          <p className="label" style={{ marginBottom: '0.6rem', fontSize: '0.6rem' }}>{tr.contact[lang]}</p>
          <a href="mailto:semia@usp.br" style={{
            fontSize: '0.82rem', color: 'var(--text-dim)',
            textDecoration: 'none', borderBottom: '1px solid var(--border)',
          }}>
            semia@usp.br
          </a>
        </div>
      </div>

      <div style={{
        marginTop: '2.5rem', paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p className="mono" style={{ color: 'var(--text-dim)', opacity: 0.55, fontSize: '0.65rem' }}>
          © 2026 semIA. {tr.rights[lang]}
        </p>

        <p className="mono" style={{ color: 'var(--text-dim)', opacity: 0.55, fontSize: '0.65rem' }}>
          ECA/USP — 30.11.2026
        </p>
      </div>
    </footer>
  )
}
