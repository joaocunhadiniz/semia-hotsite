import type { Lang } from '../lib/i18n'
import { t } from '../lib/i18n'
import SemiaBox from './SemiaBox'

interface Props { lang: Lang }

const speakers = [
  {
    name: 'Dr. Syed Mustafa Ali',
    role:        (l: Lang) => t.speakers.international[l],
    institution: 'The Open University (UK) / University of Cambridge',
    url:         'https://www.ai.hps.cam.ac.uk/co-organisers-0/dr-syed-mustafa-ali',
    talk:        (l: Lang) => t.speakers.ali.talk[l],
    bio:         (l: Lang) => t.speakers.ali.bio[l],
  },
  {
    name: 'Profa. Dra. Letícia Moraes Lima',
    role:        (l: Lang) => t.speakers.national[l],
    institution: 'Universidade Federal da Paraíba (UFPB)',
    url:         'http://lattes.cnpq.br/',
    talk:        (l: Lang) => t.speakers.lima.talk[l],
    bio:         (l: Lang) => t.speakers.lima.bio[l],
  },
]

export default function Speakers({ lang }: Props) {
  return (
    <section id="speakers" style={{
      maxWidth: 900, margin: '0 auto', padding: '0 2rem 7rem',
      position: 'relative', zIndex: 1,
    }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text)', textTransform: 'uppercase', margin: 0, marginBottom: '1rem' }}>{t.speakers.label[lang]}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {speakers.map(sp => (
          <SemiaBox key={sp.name} style={{ padding: '2rem' }}>
            <p className="label" style={{ marginBottom: '0.6rem', color: 'var(--text-dim)' }}>
              {sp.role(lang)}
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.2rem' }}>
              {sp.name}
            </h3>
            <p className="mono" style={{ color: 'var(--text-dim)', marginBottom: '1.4rem' }}>
              {sp.institution}
            </p>
            <p style={{
              fontFamily: 'var(--font-display)', fontStyle: 'italic',
              fontSize: '0.97rem', color: 'var(--accent)',
              marginBottom: '1.2rem', lineHeight: 1.5,
            }}>
              {sp.talk(lang)}
            </p>
            <p style={{
              fontSize: '0.85rem', color: 'var(--text-dim)',
              lineHeight: 1.75, marginBottom: '1.2rem',
            }}>
              {sp.bio(lang)}
            </p>
            <a href={sp.url} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              color: 'var(--accent)', textDecoration: 'none',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              borderBottom: '1px solid var(--border)',
            }}>
              {lang === 'pt' ? 'Ver perfil ↗' : 'View profile ↗'}
            </a>
          </SemiaBox>
        ))}
      </div>
    </section>
  )
}
