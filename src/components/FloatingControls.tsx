import { useState } from 'react'
import type { Lang } from '../lib/i18n'

interface Props {
  lang: Lang
  setLang: (l: Lang) => void
  psilocybin: boolean
  onPsilocybin: () => void
  growthSpeed: number
  lineScale: number
  opacity: number
  dissolution: number
  hue: number
  entropy: number
  coverage: number
  onGrowthSpeed: (v: number) => void
  onLineScale: (v: number) => void
  onOpacity: (v: number) => void
  onDissolution: (v: number) => void
  onHue: (v: number) => void
  onEntropy: (v: number) => void
  onCoverage: (v: number) => void
}

const MushroomIcon = () => (
  <svg width="11" height="11" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated', display: 'block', flexShrink: 0 }}>
    <rect x="2" y="0" width="4" height="1" fill="currentColor"/>
    <rect x="1" y="1" width="6" height="3" fill="currentColor"/>
    <rect x="0" y="3" width="8" height="1" fill="currentColor"/>
    <rect x="1" y="1" width="1" height="1" fill="rgba(245,243,238,0.55)"/>
    <rect x="5" y="2" width="1" height="1" fill="rgba(245,243,238,0.55)"/>
    <rect x="3" y="4" width="2" height="1" fill="currentColor"/>
    <rect x="3" y="5" width="2" height="2" fill="currentColor"/>
    <rect x="2" y="7" width="4" height="1" fill="currentColor"/>
  </svg>
)

const btn: React.CSSProperties = {
  fontFamily: "'Space Mono', 'Courier New', monospace",
  fontSize: '0.58rem',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  background: 'transparent',
  color: 'var(--text-dim)',
  border: '1px solid var(--border)',
  padding: '4px 10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
}

type SliderProps = {
  label: string
  min: number; max: number; step: number
  value: number
  onChange: (v: number) => void
  left: string; right: string
  displayFn?: (v: number) => string
  gradient?: string
}

function Slider({ label, min, max, step, value, onChange, left, right, displayFn, gradient }: SliderProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.3rem' }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', margin: 0 }}>
          {label}
        </p>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '0.52rem', color: 'var(--text-dim)', opacity: 0.6 }}>
          {displayFn ? displayFn(value) : value.toFixed(2) + '×'}
        </span>
      </div>
      {gradient && (
        <div style={{ height: 3, borderRadius: 2, background: gradient, marginBottom: 4, opacity: 0.5 }} />
      )}
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer', margin: 0 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'Space Mono', monospace", fontSize: '0.48rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', opacity: 0.5, marginTop: 2 }}>
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  )
}

export default function FloatingControls({
  lang, setLang, psilocybin, onPsilocybin,
  growthSpeed, lineScale, opacity, dissolution, hue, entropy, coverage,
  onGrowthSpeed, onLineScale, onOpacity, onDissolution, onHue, onEntropy, onCoverage,
}: Props) {
  const [open, setOpen] = useState(false)
  const pt = lang === 'pt'

  const hueColor = `hsl(${(33 + hue + 360) % 360},37%,40%)`

  return (
    <div style={{
      position: 'fixed',
      top: '1.2rem',
      right: '1.8rem',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '0.5rem',
    }}>

      {open && (
        <div style={{
          background: 'rgba(245,243,238,0.97)',
          border: '1px solid var(--border)',
          padding: '1.2rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem 1.8rem',
          minWidth: 380,
          backdropFilter: 'blur(10px)',
        }}>
          <Slider
            label={pt ? 'Velocidade' : 'Speed'}
            min={0.1} max={4} step={0.05} value={growthSpeed} onChange={onGrowthSpeed}
            left={pt ? 'lento' : 'slow'} right={pt ? 'rápido' : 'fast'}
          />
          <Slider
            label={pt ? 'Espessura' : 'Thickness'}
            min={0.3} max={3} step={0.05} value={lineScale} onChange={onLineScale}
            left={pt ? 'fino' : 'thin'} right={pt ? 'grosso' : 'thick'}
          />
          <Slider
            label={pt ? 'Opacidade' : 'Opacity'}
            min={0.1} max={2} step={0.05} value={opacity} onChange={onOpacity}
            left={pt ? 'fantasma' : 'ghost'} right={pt ? 'sólido' : 'solid'}
          />
          <Slider
            label={pt ? 'Dissolução' : 'Dissolution'}
            min={0.1} max={5} step={0.1} value={dissolution} onChange={onDissolution}
            left={pt ? 'persiste' : 'persist'} right={pt ? 'efêmero' : 'ephemeral'}
          />
          <Slider
            label={pt ? 'Matiz' : 'Hue'}
            min={-60} max={180} step={1} value={hue} onChange={onHue}
            left='←' right='→'
            displayFn={() => ''}
            gradient={`linear-gradient(to right, hsl(${(33-60+360)%360},37%,40%), hsl(33,37%,40%), hsl(${(33+180)%360},37%,40%))`}
          />
          <Slider
            label={pt ? 'Entropia' : 'Entropy'}
            min={0} max={4} step={0.1} value={entropy} onChange={onEntropy}
            left={pt ? 'ordenado' : 'ordered'} right={pt ? 'caótico' : 'chaotic'}
          />
          <Slider
            label={pt ? 'Cobertura' : 'Coverage'}
            min={40} max={800} step={10} value={coverage} onChange={onCoverage}
            left={pt ? 'esparso' : 'sparse'} right={pt ? 'denso' : 'dense'}
            displayFn={v => String(Math.round(v))}
          />
          <div />

          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.2rem' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: hueColor, border: '1px solid var(--border)', flexShrink: 0 }} />
            <button
              style={{ ...btn, flex: 1, justifyContent: 'center', fontSize: '0.5rem' }}
              onClick={() => { onGrowthSpeed(1); onLineScale(1); onOpacity(1); onDissolution(1); onHue(0); onEntropy(0); onCoverage(320) }}
            >
              ↺ {pt ? 'restaurar padrões' : 'reset defaults'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <button style={btn} onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}>
          {lang === 'pt' ? 'EN' : 'PT'}
        </button>
        <button style={btn} onClick={() => window.location.reload()}>↺</button>
        <button
          style={{ ...btn, background: open ? '#0f0e0b' : 'transparent', color: open ? '#f5f3ee' : 'var(--text-dim)', border: `1px solid ${open ? '#0f0e0b' : 'var(--border)'}`, transition: 'all 0.3s' }}
          onClick={() => setOpen(o => !o)}
        >
          ◈ RIZOMA
        </button>
        <button
          onClick={onPsilocybin}
          style={{ ...btn, background: psilocybin ? '#0f0e0b' : 'transparent', color: psilocybin ? '#f5f3ee' : 'var(--text-dim)', border: `1px solid ${psilocybin ? '#0f0e0b' : 'var(--border)'}`, transition: 'all 0.4s' }}
        >
          <MushroomIcon />
          {psilocybin ? 'EXIT' : 'PSILOCIBINA'}
        </button>
      </div>
    </div>
  )
}
