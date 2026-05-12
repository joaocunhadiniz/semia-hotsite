import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import SemiaBox from './SemiaBox'

interface Props { lang: Lang }

export default function Roundtables({ lang }: Props) {
  return (
    <section id="roundtables" style={{
      maxWidth: 900, margin: '0 auto', padding: '0 2rem 7rem',
      position: 'relative', zIndex: 1,
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', textTransform: 'uppercase', margin: 0, marginBottom: '1rem' }}>{t.roundtables.label[lang]}</p>

      <SemiaBox>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {t.roundtables.rooms.map((room, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '140px 1fr',
              gap: '2rem', padding: '1.4rem 2rem',
              borderBottom: i < t.roundtables.rooms.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span className="mono" style={{ color: 'var(--text-dim)', paddingTop: 2 }}>
                {lang === 'pt' ? `Sala ${room.number}` : `Room ${room.number}`}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem', color: 'var(--text)',
              }}>
                {lang === 'pt' ? room.pt : room.en}
              </span>
            </div>
          ))}
        </div>
      </SemiaBox>
    </section>
  )
}
