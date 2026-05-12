import { useState, useEffect, useRef } from 'react'
import type { Lang } from './lib/i18n'
import { useDecay } from './hooks/useDecay'
import MyceliumCanvas from './components/MyceliumCanvas'
import MushroomCursor from './components/MushroomCursor'
import GrainOverlay from './components/GrainOverlay'
import FloatingControls from './components/FloatingControls'
import Hero from './components/Hero'
import About from './components/About'
import Speakers from './components/Speakers'
import Schedule from './components/Schedule'
import Roundtables from './components/Roundtables'
import Registration from './components/Registration'
import Venue from './components/Venue'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  const [lang, setLang]             = useState<Lang>('pt')
  const [psilocybin, setPsilocybin] = useState(false)
  const [growthSpeed, setGrowthSpeed]   = useState(1)
  const [lineScale, setLineScale]       = useState(1)
  const [opacity, setOpacity]           = useState(1)
  const [dissolution, setDissolution]   = useState(1)
  const [hue, setHue]                   = useState(0)
  const [entropy, setEntropy]           = useState(0)
  const [coverage, setCoverage]         = useState(320)
  const decayLevel                  = useDecay(45_000)

  const turbRef    = useRef<SVGFETurbulenceElement>(null)
  const displacRef = useRef<SVGFEDisplacementMapElement>(null)

  useEffect(() => {
    turbRef.current?.setAttribute('baseFrequency', (0.012 + decayLevel * 0.09).toFixed(4))
    displacRef.current?.setAttribute('scale', (decayLevel * 24).toFixed(1))
  }, [decayLevel])

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      {/* SVG decay filter — must be in DOM before use */}
      <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }} aria-hidden="true">
        <defs>
          <filter id="decay-filter" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              ref={displacRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <MushroomCursor active={psilocybin} />
      {!psilocybin && <MyceliumCanvas
        decayLevel={decayLevel} psilocybin={psilocybin}
        growthSpeed={growthSpeed} lineScale={lineScale}
        opacity={opacity} dissolution={dissolution} hue={hue} entropy={entropy} coverage={coverage}
      />}
      <GrainOverlay />
      <FloatingControls
        lang={lang} setLang={setLang}
        psilocybin={psilocybin} onPsilocybin={() => setPsilocybin(p => !p)}
        growthSpeed={growthSpeed} onGrowthSpeed={setGrowthSpeed}
        lineScale={lineScale} onLineScale={setLineScale}
        opacity={opacity} onOpacity={setOpacity}
        dissolution={dissolution} onDissolution={setDissolution}
        hue={hue} onHue={setHue}
        entropy={entropy} onEntropy={setEntropy}
        coverage={coverage} onCoverage={setCoverage}
      />

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          filter: decayLevel > 0.03 ? 'url(#decay-filter)' : 'none',
        }}
      >
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', maxWidth: 900, margin: '0 auto' }}>
          <Hero lang={lang} />
          <About lang={lang} />
        </div>
        <Speakers lang={lang} />
        <Schedule lang={lang} />
        <Roundtables lang={lang} />
        <Registration lang={lang} />
        <Venue lang={lang} />
      </main>

      <Footer lang={lang} />
    </div>
  )
}
