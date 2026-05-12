import { useState, useEffect, useRef } from 'react'

const DECAY_DURATION = 120_000

export function useDecay(thresholdMs = 10_000): number {
  const [decayLevel, setDecayLevel] = useState(0)
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const decayTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const decayStart = useRef(0)

  useEffect(() => {
    function startDecay() {
      decayStart.current = Date.now()
      decayTimer.current = setInterval(() => {
        const elapsed = Date.now() - decayStart.current
        setDecayLevel(Math.min(1, elapsed / DECAY_DURATION))
      }, 100)
    }

    function reset() {
      setDecayLevel(0)
      if (decayTimer.current) { clearInterval(decayTimer.current); decayTimer.current = null }
      if (idleTimer.current)  clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(startDecay, thresholdMs)
    }

    reset()
    window.addEventListener('scroll',     reset, { passive: true })
    window.addEventListener('mousemove',  reset, { passive: true })
    window.addEventListener('keydown',    reset)
    window.addEventListener('touchstart', reset, { passive: true })

    return () => {
      if (idleTimer.current)  clearTimeout(idleTimer.current)
      if (decayTimer.current) clearInterval(decayTimer.current)
      window.removeEventListener('scroll',     reset)
      window.removeEventListener('mousemove',  reset)
      window.removeEventListener('keydown',    reset)
      window.removeEventListener('touchstart', reset)
    }
  }, [thresholdMs])

  return decayLevel
}
