import { useEffect, useRef, useCallback } from 'react'

// ─── Seeded PRNG ──────────────────────────────────────────────────────────────
function mulberry32(seed: number) {
  let s = seed
  return () => {
    s += 0x6D2B79F5
    let t = s
    t = Math.imul(t ^ (t >>> 15), 1 | t)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Path segment ────────────────────────────────────────────────────────────
interface Seg { d: string; w: number; o: number }

// angle=0 → straight down; positive → right; negative → left
function grow(
  rand: () => number,
  x: number, y: number,
  angle: number,
  len: number,
  depth: number,
  xMin: number, xMax: number, yMax: number,
  out: Seg[]
) {
  if (depth <= 0 || len < 5 || y > yMax) return

  const rad = (angle * Math.PI) / 180
  const ex = x + Math.sin(rad) * len
  const ey = y + Math.cos(rad) * len

  if (ex < xMin || ex > xMax) return

  // tiny control-point offset for organic curve
  const cpx = (x + ex) / 2 + (rand() - 0.5) * len * 0.18
  const cpy = (y + ey) / 2 + (rand() - 0.5) * len * 0.12

  out.push({
    d: `M${x.toFixed(1)},${y.toFixed(1)} Q${cpx.toFixed(1)},${cpy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`,
    w: Math.max(0.25, 0.85 * (depth / 8)),
    o: Math.min(0.38, 0.1 + depth * 0.038),
  })

  // main continuation
  grow(rand, ex, ey, angle + (rand() - 0.5) * 18, len * (0.88 + rand() * 0.1),
    depth - (rand() < 0.08 ? 1 : 0), xMin, xMax, yMax, out)

  // branch
  if (depth >= 2 && rand() < 0.32) {
    const side = rand() > 0.5 ? 1 : -1
    grow(rand, ex, ey, angle + side * (28 + rand() * 28), len * (0.48 + rand() * 0.22),
      depth - 2, xMin, xMax, yMax, out)
  }
}

// ─── Pre-generate paths (deterministic) ─────────────────────────────────────
const VSPACE = 2600  // virtual page height for the hyphae coordinate space
const W = 68         // margin width

function buildPaths(seed: number): Seg[] {
  const rand = mulberry32(seed)
  const segs: Seg[] = []
  // multiple origin points down the left margin
  const origins = [
    [W - 12, 80,   2,  42, 9],
    [W - 8,  520,  -4, 38, 8],
    [W - 14, 1050, 5,  36, 8],
    [W - 10, 1560, -2, 34, 7],
    [W - 16, 2050, 3,  32, 7],
  ]
  for (const [sx, sy, sa, sl, sd] of origins) {
    grow(rand, sx, sy, sa, sl, sd, 2, W - 2, VSPACE, segs)
  }
  return segs
}

const LEFT_SEGS  = buildPaths(7331)
const RIGHT_SEGS = buildPaths(1847)

// ─── Component ───────────────────────────────────────────────────────────────
export default function MyceliumSVG() {
  const leftRef  = useRef<SVGSVGElement>(null)
  const rightRef = useRef<SVGSVGElement>(null)
  const rafRef   = useRef<number>(0)

  const update = useCallback(() => {
    const vh = window.innerHeight
    const maxScroll = Math.max(1, document.body.scrollHeight - vh)
    const progress = Math.min(1, window.scrollY / maxScroll)
    const viewY = progress * (VSPACE - vh)

    const vb = `0 ${viewY.toFixed(1)} ${W} ${vh}`
    leftRef.current?.setAttribute('viewBox', vb)
    rightRef.current?.setAttribute('viewBox', vb)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const renderPaths = (segs: Seg[]) =>
    segs.map((s, i) => (
      <path
        key={i}
        d={s.d}
        fill="none"
        stroke="var(--hypha)"
        strokeWidth={s.w}
        opacity={s.o}
        strokeLinecap="round"
      />
    ))

  const svgStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    width: `${W}px`,
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 0,
    overflow: 'visible',
  }

  return (
    <>
      <svg ref={leftRef}  style={{ ...svgStyle, left: 0 }}>
        {renderPaths(LEFT_SEGS)}
      </svg>
      <svg ref={rightRef} style={{ ...svgStyle, right: 0, transform: 'scaleX(-1)' }}>
        {renderPaths(RIGHT_SEGS)}
      </svg>
    </>
  )
}
