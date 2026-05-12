import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import SemiaBox from './SemiaBox'

interface Props { lang: Lang }

const typeAccent: Record<string, string> = {
  keynote:    'var(--accent)',
  roundtable: 'var(--text)',
  parallel:   'var(--text)',
  opening:    'var(--text-dim)',
  break:      'var(--text-dim)',
  poster:     'var(--text)',
  closing:    'var(--text-dim)',
}

export default function Schedule({ lang }: Props) {
  return (
    <section id="schedule" style={{
      maxWidth: 900, margin: '0 auto', padding: '0 2rem 7rem',
      position: 'relative', zIndex: 1,
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', textTransform: 'uppercase', margin: 0, marginBottom: '1rem' }}>{t.schedule.label[lang]}</p>

      <SemiaBox>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {t.schedule.items.map((item, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '140px 1fr',
              gap: '2rem', padding: '1.1rem 2rem',
              borderTop: i === 0 ? 'none' : 'none',
              borderBottom: i < t.schedule.items.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span className="mono" style={{ color: 'var(--text-dim)', paddingTop: 2 }}>
                {item.time}
              </span>
              <span style={{
                fontSize: '0.9rem',
                color: typeAccent[item.type],
                fontFamily: 'var(--font-mono)',
              }}>
                {lang === 'pt' ? item.pt : item.en}
              </span>
            </div>
          ))}
        </div>
      </SemiaBox>
    </section>
  )
}
