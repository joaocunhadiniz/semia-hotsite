function buildPerm(seed: number): Uint8Array {
  const p = Array.from({ length: 256 }, (_, i) => i)
  let s = seed >>> 0
  for (let i = 255; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  const perm = new Uint8Array(512)
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  return perm
}

const PERM = buildPerm(0x9e3779b9)

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerp(a: number, b: number, t: number) { return a + t * (b - a) }

function grad2(h: number, x: number, y: number): number {
  switch (h & 3) {
    case 0: return  x + y
    case 1: return -x + y
    case 2: return  x - y
    default: return -x - y
  }
}

export function perlin2(x: number, y: number): number {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  x -= Math.floor(x)
  y -= Math.floor(y)
  const u = fade(x), v = fade(y)
  const aa = PERM[PERM[X]     + Y]
  const ab = PERM[PERM[X]     + Y + 1]
  const ba = PERM[PERM[X + 1] + Y]
  const bb = PERM[PERM[X + 1] + Y + 1]
  return lerp(
    lerp(grad2(aa, x, y),     grad2(ba, x - 1, y),     u),
    lerp(grad2(ab, x, y - 1), grad2(bb, x - 1, y - 1), u),
    v,
  )
}
