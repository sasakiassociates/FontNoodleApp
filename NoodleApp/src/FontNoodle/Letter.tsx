import {betterLetters, alt2} from "./Storage.tsx"
import {fillLetter} from "./Randomisation.ts"

export function Letterify2(props:{name:string, seed:number, palette?:string[], contrast?:number}) {
    const {palette=alt2[1], contrast=1.6, seed, name} = props
    const activeLetter = betterLetters.find(v=>v.name===name)
    if (!activeLetter) return null
    const colorify = fillLetter(activeLetter, seed, palette, contrast)
    if (colorify.length < activeLetter.paths.length) {colorify.push("#ffffff")}
    return (<g transform={`translate(${-activeLetter.bbox.minX},${-activeLetter.bbox.minY})`}>
        {activeLetter.paths.map((v,i)=><path 
        key={i}
        d={v}
        fill={colorify[i]}
        />)}
    </g>
)}