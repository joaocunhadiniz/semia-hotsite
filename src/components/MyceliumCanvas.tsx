import { useRef, useEffect } from 'react'
import { perlin2 } from '../lib/perlin'

interface Props {
  decayLevel: number
  psilocybin: boolean
  growthSpeed: number   // multiplier: 0.25 → 4
  lineScale: number     // multiplier: 0.5 → 2.0
  opacity: number       // multiplier: 0.1 → 2.0
  dissolution: number   // fade speed multiplier: 0.1 → 5
  hue: number           // hue offset in degrees: -60 → +180
  entropy: number       // wobble strength: 0 → 4
  coverage: number      // attractor count: 40 → 800
}

interface Vec2 { x: number; y: number }
interface SCNode { pos: Vec2; parent: number | null; dir: Vec2; step: number; age: number }
interface PsiParticle { x: number; y: number; vx: number; vy: number; trail: Vec2[] }
interface NetSeg { fx: number; fy: number; tx: number; ty: number; t: number }

// ─── tunables ────────────────────────────────────────────────────
const INFLUENCE_R   = 160
const KILL_R        = 14
const SEG_LEN       = 7
const MAX_STEPS     = 560
const MAX_NODES     = 3600
const GROWTH_MS     = 300_000  // 5min to reach full network
const NET_LIFESPAN  = 28_000
const MAX_NET_SEGS  = 50_000
const GRID_SIZE     = 200
const MYCO_API      = 'http://localhost:8080'

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function dist2(a: Vec2, b: Vec2) { const dx = a.x-b.x, dy = a.y-b.y; return dx*dx+dy*dy }
function norm(v: Vec2): Vec2 { const l = Math.sqrt(v.x*v.x+v.y*v.y)||1; return {x:v.x/l, y:v.y/l} }

// node hash for stagger jitter so segments don't appear as blocks
function nodeHash(pos: Vec2): number {
  const h = Math.sin(pos.x * 127.1 + pos.y * 311.7) * 43758.5453
  return h - Math.floor(h)
}

function buildSpaceColonization(W: number, H: number, attractorCount = 320): SCNode[] {
  const rng = mulberry32(0xca11ab1e)
  type Att = { pos: Vec2; active: boolean }
  const att: Att[] = []

  for (let i = 0; i < attractorCount; i++) {
    att.push({ pos: { x: rng() * W, y: rng() * H }, active: true })
  }

  const nodes: SCNode[] = []
  const frontier: number[] = []

  // Seeds from all 4 edges (left, right, top, bottom)
  const fracs = [0.08, 0.18, 0.30, 0.42, 0.54, 0.66, 0.78, 0.90]
  for (const f of fracs) {
    // left → right
    let i = nodes.length
    nodes.push({ pos:{x:2, y:f*H}, parent:null, dir:{x:1, y:(rng()-0.5)*0.3}, step:0, age:rng() })
    frontier.push(i)
    // right → left
    i = nodes.length
    nodes.push({ pos:{x:W-2, y:f*H}, parent:null, dir:{x:-1, y:(rng()-0.5)*0.3}, step:0, age:rng() })
    frontier.push(i)
    // top → down
    i = nodes.length
    nodes.push({ pos:{x:f*W, y:2}, parent:null, dir:{x:(rng()-0.5)*0.3, y:1}, step:0, age:rng() })
    frontier.push(i)
    // bottom → up
    i = nodes.length
    nodes.push({ pos:{x:f*W, y:H-2}, parent:null, dir:{x:(rng()-0.5)*0.3, y:-1}, step:0, age:rng() })
    frontier.push(i)
  }

  const ir2 = INFLUENCE_R * INFLUENCE_R
  const kr2 = KILL_R * KILL_R

  for (let step = 1; step <= MAX_STEPS && nodes.length < MAX_NODES; step++) {
    const next: number[] = []
    const toKill = new Set<number>()
    for (const ni of frontier) {
      const node = nodes[ni], dirs: Vec2[] = []
      for (let ai = 0; ai < att.length; ai++) {
        if (!att[ai].active) continue
        const dd = dist2(node.pos, att[ai].pos)
        if (dd < ir2) {
          const dx = att[ai].pos.x - node.pos.x, dy = att[ai].pos.y - node.pos.y
          const l = Math.sqrt(dd) || 1
          dirs.push({ x: dx/l, y: dy/l })
          if (dd < kr2) toKill.add(ai)
        }
      }
      let growDir: Vec2
      if (dirs.length > 0) {
        const s = dirs.reduce((a,d) => ({x:a.x+d.x, y:a.y+d.y}), {x:0, y:0})
        growDir = norm(s)
        if (dirs.length >= 3 && rng() < 0.20) {
          const bd = dirs[Math.floor(rng() * dirs.length)]
          const bp = { x: node.pos.x + bd.x*SEG_LEN, y: node.pos.y + bd.y*SEG_LEN }
          if (bp.x > 2 && bp.x < W-2 && bp.y > 2 && bp.y < H-2) {
            const bi = nodes.length
            nodes.push({ pos:bp, parent:ni, dir:bd, step, age:rng() })
            next.push(bi)
          }
        }
      } else {
        const drift = (rng()-0.5) * 0.25
        growDir = norm({ x: node.dir.x + drift, y: node.dir.y + (rng()-0.45)*0.15 })
      }
      const np = { x: node.pos.x + growDir.x*SEG_LEN, y: node.pos.y + growDir.y*SEG_LEN }
      if (np.x > 2 && np.x < W-2 && np.y > 2 && np.y < H-2) {
        const ni2 = nodes.length
        nodes.push({ pos:np, parent:ni, dir:growDir, step, age:rng() })
        next.push(ni2)
      }
    }
    for (const ai of toKill) att[ai].active = false
    frontier.length = 0; frontier.push(...next)
    if (!frontier.length) break
  }
  return nodes
}

// ─── component ───────────────────────────────────────────────────

export default function MyceliumCanvas({ decayLevel, psilocybin, growthSpeed, lineScale, opacity, dissolution, hue, entropy, coverage }: Props) {
  const canvasRef        = useRef<HTMLCanvasElement>(null)
  const modeRef          = useRef<'mycorust' | 'local'>('local')
  const networkRef       = useRef<NetSeg[]>([])
  const nodesRef         = useRef<SCNode[]>([])
  const rafRef           = useRef(0)
  const decayRef         = useRef(decayLevel)
  const psiRef           = useRef(psilocybin)
  const prevPsiRef       = useRef(psilocybin)
  const simBuilt         = useRef(false)
  const particles        = useRef<PsiParticle[]>([])
  const pollRef          = useRef<ReturnType<typeof setInterval> | null>(null)
  const mountTimeRef     = useRef(Date.now())
  const prevStepRef      = useRef(-1)
  const frameRef         = useRef(0)
  const growthSpeedRef   = useRef(growthSpeed)
  const lineScaleRef     = useRef(lineScale)
  const opacityRef       = useRef(opacity)
  const dissolutionRef   = useRef(dissolution)
  const hueRef           = useRef(hue)
  const entropyRef       = useRef(entropy)
  const coverageRef      = useRef(coverage)
  const redrawSignalRef  = useRef(0)
  const lastRedrawRef    = useRef(0)

  useEffect(() => { decayRef.current       = decayLevel  }, [decayLevel])
  useEffect(() => { psiRef.current         = psilocybin  }, [psilocybin])
  useEffect(() => { growthSpeedRef.current = growthSpeed }, [growthSpeed])
  useEffect(() => { lineScaleRef.current   = lineScale;   redrawSignalRef.current++ }, [lineScale])
  useEffect(() => { opacityRef.current     = opacity;     redrawSignalRef.current++ }, [opacity])
  useEffect(() => { dissolutionRef.current = dissolution }, [dissolution])
  useEffect(() => { hueRef.current         = hue;         redrawSignalRef.current++ }, [hue])
  useEffect(() => { entropyRef.current     = entropy;     redrawSignalRef.current++ }, [entropy])

  // rebuild SC when coverage changes (local mode only)
  useEffect(() => {
    coverageRef.current = coverage
    if (modeRef.current !== 'local') return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    simBuilt.current = false
    setTimeout(() => {
      if (simBuilt.current) return
      simBuilt.current = true
      nodesRef.current = buildSpaceColonization(canvas.width, canvas.height, coverageRef.current)
      mountTimeRef.current = Date.now()
      prevStepRef.current = -1
    }, 100)
  }, [coverage])

  // ── probe mycorust (only on localhost), else build local SC ──
  useEffect(() => {
    if (window.location.hostname !== 'localhost') {
      setTimeout(() => {
        if (simBuilt.current) return
        simBuilt.current = true
        const W = window.innerWidth
        const H = window.innerHeight
        nodesRef.current = buildSpaceColonization(W, H, coverageRef.current)
        mountTimeRef.current = Date.now() - GROWTH_MS * 0.5
        prevStepRef.current = -1
      }, 600)
      return
    }
    fetch(`${MYCO_API}/stats`, { signal: AbortSignal.timeout(1500) })
      .then(() => {
        modeRef.current = 'mycorust'
        fetch(`${MYCO_API}/reset`, { method: 'POST' }).catch(() => {})
        pollRef.current = setInterval(() => {
          fetch(`${MYCO_API}/hyphae`)
            .then(r => r.json())
            .then((data: [number, number, number, number, number][]) => {
              const now = Date.now()
              const incoming: NetSeg[] = data.map(([px, py, x, y]) => ({
                fx: px, fy: py, tx: x, ty: y, t: now,
              }))
              const fresh = networkRef.current.filter(s => now - s.t < NET_LIFESPAN)
              const merged = fresh.concat(incoming)
              networkRef.current = merged.length > MAX_NET_SEGS
                ? merged.slice(merged.length - MAX_NET_SEGS)
                : merged
            })
            .catch(() => {})
        }, 125)
      })
      .catch(() => {
        // build local SC after layout settles
        setTimeout(() => {
          if (simBuilt.current) return
          simBuilt.current = true
          const W = window.innerWidth
          const H = window.innerHeight
          nodesRef.current = buildSpaceColonization(W, H, coverageRef.current)
          mountTimeRef.current = Date.now()
          prevStepRef.current = -1
        }, 600)
      })
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [])

  // ── render loop ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      // preserve canvas on resize by saving and restoring
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      // rebuild SC for new viewport
      if (modeRef.current === 'local') {
        simBuilt.current = false
        setTimeout(() => {
          if (simBuilt.current) return
          simBuilt.current = true
          nodesRef.current = buildSpaceColonization(canvas.width, canvas.height, coverageRef.current)
          mountTimeRef.current = Date.now()
          prevStepRef.current = -1
        }, 200)
      }
    }
    resize()
    window.addEventListener('resize', resize)

    particles.current = Array.from({ length: 200 }, () => ({
      x: Math.random()*window.innerWidth, y: Math.random()*window.innerHeight,
      vx: 0, vy: 0, trail: [],
    }))

    const draw = () => {
      const W     = canvas.width
      const H     = canvas.height
      const decay = decayRef.current
      const psi   = psiRef.current

      frameRef.current++

      // ── clear on psilocybin toggle off ──────────────────────
      if (!psi && prevPsiRef.current) ctx.clearRect(0, 0, W, H)
      prevPsiRef.current = psi

      if (psi) {
        // ── Psilocybin flow field (unchanged) ─────────────────
        ctx.fillStyle = 'rgba(245,243,238,0.028)'
        ctx.fillRect(0, 0, W, H)
        const time = Date.now() * 0.00024
        for (const p of particles.current) {
          const angle = perlin2(p.x*0.0028, p.y*0.0028+time) * Math.PI * 4
          p.vx = p.vx*0.86 + Math.cos(angle)*1.0
          p.vy = p.vy*0.86 + Math.sin(angle)*1.0
          p.x  = (p.x + p.vx + W) % W
          p.y  = (p.y + p.vy + H) % H
          p.trail.push({x:p.x, y:p.y})
          if (p.trail.length > 60) p.trail.shift()
          if (p.trail.length < 2)  continue
          const speed = Math.sqrt(p.vx**2+p.vy**2), ab = Math.min(speed*1.4,5), frac = p.trail.length/60
          const drawTrail = (offX: number, color: string, lw: number) => {
            ctx.beginPath(); ctx.moveTo(p.trail[0].x+offX, p.trail[0].y)
            for (let i=1; i<p.trail.length; i++) ctx.lineTo(p.trail[i].x+offX, p.trail[i].y)
            ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.stroke()
          }
          drawTrail( ab, `rgba(210,70,50,${(frac*0.13).toFixed(3)})`,  0.65)
          drawTrail(-ab, `rgba(40,80,210,${(frac*0.13).toFixed(3)})`,  0.65)
          drawTrail(  0, `rgba(138,104,64,${(frac*0.44).toFixed(3)})`, 0.5)
        }

      } else if (modeRef.current === 'mycorust') {
        // ── mycorust: persistent canvas, show all network ──────
        // gentle fade every 4 frames
        if (frameRef.current % 4 === 0) {
          ctx.fillStyle = 'rgba(245,243,238,0.007)'
          ctx.fillRect(0, 0, W, H)
        }
        const segs = networkRef.current
        if (!segs.length) { rafRef.current = requestAnimationFrame(draw); return }

        const sx = W / GRID_SIZE
        const sy = H / GRID_SIZE
        const now = Date.now()

        type Pt = [number, number, number, number]
        const young: Pt[] = [], mid: Pt[] = [], old: Pt[] = []

        for (const seg of segs) {
          const ageFrac = Math.min(1, (now - seg.t) / NET_LIFESPAN)
          const fx = seg.fx * sx, fy = seg.fy * sy
          const tx = seg.tx * sx, ty = seg.ty * sy
          const pt: Pt = [fx, fy, tx, ty]
          if      (ageFrac < 0.25) young.push(pt)
          else if (ageFrac < 0.65) mid.push(pt)
          else                     old.push(pt)
        }

        const batch = (pts: Pt[], alpha: number, lw: number) => {
          if (!pts.length) return
          ctx.beginPath()
          for (const [fx,fy,tx,ty] of pts) { ctx.moveTo(fx,fy); ctx.lineTo(tx,ty) }
          ctx.strokeStyle = `rgba(138,104,64,${alpha.toFixed(3)})`
          ctx.lineWidth = lw
          ctx.stroke()
        }
        batch(young, 0.62 + decay*0.28, 1.6)
        batch(mid,   0.40 + decay*0.22, 1.1)
        batch(old,   0.18 + decay*0.18, 0.7)

      } else {
        // ── local SC: persistent canvas, time-driven growth ────
        const nodes = nodesRef.current
        if (!nodes.length) { rafRef.current = requestAnimationFrame(draw); return }

        // param changed: clear + redraw all revealed segments instantly
        if (redrawSignalRef.current !== lastRedrawRef.current) {
          lastRedrawRef.current = redrawSignalRef.current
          ctx.clearRect(0, 0, W, H)
          const snapStep = prevStepRef.current < 0 ? 0 : prevStepRef.current
          const baseA = 0.50 + decay * 0.38
          const h0 = (33 + hueRef.current + 360) % 360
          for (const node of nodes) {
            if (node.parent === null) continue
            const jitter = nodeHash(node.pos) * 14
            if (node.step + jitter > snapStep) continue
            const parent    = nodes[node.parent]
            const depthFade = Math.max(0.18, 1 - node.step / MAX_STEPS)
            const alpha     = Math.min(1, baseA * depthFade * opacityRef.current)
            const lw        = Math.max(0.4, (2.8 - node.step * 0.003) * (1 + decay * 0.5) * lineScaleRef.current)
            const e  = entropyRef.current
            const wx = e > 0 ? (node.age - 0.5) * e * 5 : 0
            const wy = e > 0 ? ((node.age * 7.3321) % 1 - 0.5) * e * 5 : 0
            ctx.beginPath()
            ctx.moveTo(parent.pos.x, parent.pos.y)
            ctx.lineTo(node.pos.x + wx, node.pos.y + wy)
            ctx.strokeStyle = `hsla(${h0},37%,40%,${alpha.toFixed(3)})`
            ctx.lineWidth = lw
            ctx.stroke()
          }
        }

        // gentle fade every 3 frames — speed controlled by dissolution
        if (frameRef.current % 3 === 0) {
          const fadeAlpha = Math.min(0.08, 0.005 * dissolutionRef.current)
          ctx.fillStyle = `rgba(245,243,238,${fadeAlpha})`
          ctx.fillRect(0, 0, W, H)
        }

        // time-based visStep — no scroll, only elapsed time
        const elapsed = Date.now() - mountTimeRef.current
        const rawStep = elapsed * MAX_STEPS / GROWTH_MS * growthSpeedRef.current
        const visStep = rawStep

        if (visStep <= prevStepRef.current) {
          rafRef.current = requestAnimationFrame(draw)
          return
        }

        // paint only NEWLY revealed segments this frame
        const baseAlpha = 0.50 + decay * 0.38
        for (const node of nodes) {
          if (node.parent === null) continue
          // per-node stagger: jitter up to 14 steps based on position hash
          const jitter = nodeHash(node.pos) * 14
          const effectiveStep = node.step + jitter
          if (effectiveStep > visStep || effectiveStep <= prevStepRef.current) continue

          const parent = nodes[node.parent]
          const depthFade = Math.max(0.18, 1 - node.step / MAX_STEPS)
          const alpha = Math.min(1, baseAlpha * depthFade * opacityRef.current)
          const lw = Math.max(0.4, (2.8 - node.step * 0.003) * (1 + decay * 0.5) * lineScaleRef.current)
          const h = (33 + hueRef.current + 360) % 360

          // entropy: bake random wobble into the segment when first drawn
          const e = entropyRef.current
          const wx = e > 0 ? (Math.random() - 0.5) * e * 5 : 0
          const wy = e > 0 ? (Math.random() - 0.5) * e * 5 : 0

          ctx.beginPath()
          ctx.moveTo(parent.pos.x, parent.pos.y)
          ctx.lineTo(node.pos.x + wx, node.pos.y + wy)
          ctx.strokeStyle = `hsla(${h},37%,40%,${alpha.toFixed(3)})`
          ctx.lineWidth = lw
          ctx.stroke()
        }

        prevStepRef.current = visStep
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'fixed', top:0, left:0, width:'100vw', height:'100vh', zIndex:0, pointerEvents:'none' }}
    />
  )
}
