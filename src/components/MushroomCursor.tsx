import { useEffect, useRef } from 'react'

interface Props { active: boolean }

class Shroom {
  pos: { x: number; y: number }[]
  curr: { x: number; y: number }
  t: number
  lifeSpan: number
  lifeSpanStart: number
  hue: number
  dy: number

  constructor(x: number, y: number) {
    this.pos = [{ x, y }]
    this.curr = { x, y }
    this.t = Math.random() * 1000
    this.lifeSpan = 50 + Math.random() * 50
    this.lifeSpanStart = this.lifeSpan
    this.hue = Math.random() * 255
    this.dy = 1 + Math.random() * 2
  }

  private noise(t: number) {
    return (Math.sin(t * 3.14159) * 0.5 + Math.cos(t * 2.17) * 0.3 + Math.sin(t * 5.11) * 0.2) * 0.5 + 0.5
  }

  grow() {
    if (this.lifeSpan <= 0) return
    this.t += 0.02
    const dx = (this.noise(this.t) * 2 - 1) * 3
    this.curr = { x: this.curr.x + dx, y: this.curr.y - this.dy }
    this.pos.push({ ...this.curr })
    this.lifeSpan--
  }

  display(ctx: CanvasRenderingContext2D) {
    const l = this.pos.length
    for (let i = 0; i < l; i++) {
      const v = this.pos[i]
      const weight = 10 - (i / l) * 5
      const lightness = 30 + (i / l) * 30
      ctx.strokeStyle = `hsla(${this.hue}, 55%, ${lightness}%, 0.9)`
      ctx.lineWidth = weight
      ctx.beginPath()
      ctx.arc(v.x, v.y, weight / 2, 0, Math.PI * 2)
      ctx.stroke()
    }
    const tip = this.pos[l - 1]
    const capW = (15 + (l / this.lifeSpanStart) * 35) / 2
    ctx.fillStyle = `hsla(${this.hue}, 55%, 55%, 0.85)`
    ctx.beginPath()
    ctx.ellipse(tip.x, tip.y, capW, 7.5, 0, 0, Math.PI * 2)
    ctx.fill()
  }
}

export default function MushroomCursor({ active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shroomsRef = useRef<Shroom[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    document.body.style.cursor = active ? 'none' : ''
    return () => { document.body.style.cursor = '' }
  }, [active])

  useEffect(() => {
    if (!active) {
      shroomsRef.current = []
      cancelAnimationFrame(rafRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove)

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      shroomsRef.current.push(new Shroom(mouseRef.current.x, mouseRef.current.y))
      shroomsRef.current.forEach(s => { s.display(ctx); s.grow() })
      shroomsRef.current = shroomsRef.current.filter(s => s.lifeSpan > 0)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    />
  )
}
