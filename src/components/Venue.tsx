import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import SemiaBox from './SemiaBox'

interface Props { lang: Lang }

export default function Venue({ lang }: Props) {
  const tr = t.venue
  return (
    <section id="venue" style={{
      maxWidth: 900, margin: '0 auto', padding: '0 2rem 7rem',
      position: 'relative', zIndex: 1,
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', textTransform: 'uppercase', margin: 0, marginBottom: '1rem' }}>{tr.label[lang]}</p>

      <SemiaBox style={{ padding: '2rem' }}>
        <p className="mono" style={{ color: 'var(--text-dim)', whiteSpace: 'pre-line', lineHeight: 1.9, marginBottom: '1rem' }}>
          {tr.address[lang]}
        </p>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
          {tr.note[lang]}
        </p>
      </SemiaBox>
    </section>
  )
}
