import chroma from "chroma-js";
import { type BetterLetter } from "./Storage";

/** 32-bit mix/hash: great as a building block for deterministic noise. */
export function hash32(x: number): number {
  // Force to uint32
  x >>>= 0;
  x = Math.imul(x ^ (x >>> 16), 0x7feb352d);
  x = Math.imul(x ^ (x >>> 15), 0x846ca68b);
  x = x ^ (x >>> 16);
  return x >>> 0;
}

/** Convert a uint32 to a float in [0, 1). */
export function u32ToUnitFloat(u: number): number {
  // 2^32 = 4294967296
  return (u >>> 0) / 4294967296;
}

/** 1D "value noise": deterministic float in [0,1) from integer x and optional seed. */
export function noise1i(x: number, seed = 0): number {
  return u32ToUnitFloat(hash32((x ^ seed) >>> 0));
}

/** Smoothstep for interpolation (0..1). */
export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * 1D smooth value noise for continuous x (not just integers).
 * Output roughly in [0,1).
 */
export function valueNoise1(x: number, seed = 0): number {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = smoothstep(x - x0);
  const a = noise1i(x0, seed);
  const b = noise1i(x1, seed);
  return a + (b - a) * t;
}


export function checkAdjacentColors(activeLetter:BetterLetter, colors:string[], contrast:number):boolean {
  return activeLetter.adjacencies.every(([a,b])=>chroma.contrast(colors[a],colors[b]) >= contrast)
}

function fillRandom(count: number, palette:string[], seed:number) {
const ans:string[] = []
let i = 0
while (ans.length < count) {
  let color = palette[Math.floor(valueNoise1(i+1.23, seed)*palette.length)]
  i++
  if (palette.length < count) {
    ans.push(color)
  } else {
    if (!ans.includes(color)) ans.push(color)
  }
}
return ans
}

export function fillLetterHeavy(activeLetter:BetterLetter, seed:number, palette:string[], contrast:number): string[] {
  if (!activeLetter) return []
  let colors:string[] = []
  let bestSoFar:number = 0
  let bestColorsSoFar:string[] = []
  const max = 10000
  for (let i = 0; i < max; i++) {
    colors = fillRandom(activeLetter.paths.length, palette, seed+i)
    if (checkAdjacentColors(activeLetter, colors, contrast)) {return(colors)} else {
      let thisRunsScore:number = 0
      activeLetter.adjacencies.map(([a,b])=>thisRunsScore = thisRunsScore + chroma.contrast(colors[a], colors[b]))
      if (thisRunsScore > bestSoFar) {
        bestSoFar = thisRunsScore
        bestColorsSoFar = colors
      }
      }
    if (i === max-1) colors = bestColorsSoFar
  }

  return colors
}

const letterCache:Record<string, string[]> = {}

export function fillLetter(activeLetter:BetterLetter, seed:number, palette:string[], contrast:number): string[] {
  if (!activeLetter) return []
  const key = `${activeLetter.name}; ${seed}; ${palette.join(", ")}; ${contrast}`
  if (!letterCache[key]) {
    letterCache[key] = fillLetterHeavy(activeLetter, seed, palette, contrast)
  }
  return letterCache[key]
}