import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'

interface Props { lang: Lang }

export default function About({ lang }: Props) {
  return (
    <section id="about" style={{
      padding: '0 2rem 3rem',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        <p style={{ color: 'var(--text)', fontSize: '1.08rem', lineHeight: 1.8, margin: 0 }}>
          {t.about.body[lang]}
        </p>
        <p style={{ color: 'var(--text)', fontSize: '1.08rem', lineHeight: 1.8, margin: 0 }}>
          {t.about.body2[lang]}
        </p>
      </div>
    </section>
  )
}
