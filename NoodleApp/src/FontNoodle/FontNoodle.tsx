import {Letterify2} from "./Letter.tsx";
import chroma from "chroma-js";
import { betterLetters } from "./Storage.tsx";
import { mainFile } from "../DataStorage.ts";

export type WordifyProps = {
    word:string,
    height?:number,
    letterContrast?:number,
    colorPalette:string[],
    seed:number,
    padding?:number,
    gap?:number,
    seedArray: number[][],
    index?: number
}

export type FontNoodleProps = Omit<WordifyProps, "word"> & {
    words:string[], 
    lineSpacing?:number,
    bgColor?:string,
    bgContrast?:number,
}

export function FontNoodleSVG(props:FontNoodleProps) {
    const {height=100, bgColor="#ffffff", bgContrast=3, colorPalette, words, seed, padding=0, gap=0.1, lineSpacing=5} = props
    if (!words) return null
    const newColors:string[] = colorPalette.filter(v=>chroma.contrast(v, bgColor) >= bgContrast)
    if (newColors.length === 0) return (<svg><Wordify {...props} word="error" /></svg>)
    const maxWidth = words.reduce((max, current) => max > Array.from(current).reduce((total, v)=>total + getWidth(v.toUpperCase(), height) + gap*height, 0) ? max : Array.from(current).reduce((total, v)=>total + getWidth(v.toUpperCase(), height) + gap*height, 0),0)
    return (
            <svg width={maxWidth + 2*padding-gap*height} height={(height+lineSpacing)*words.length+padding*2-lineSpacing}>
                <rect fill={bgColor} width={maxWidth+padding*2-gap*height} height={(height+lineSpacing)*words.length+padding*2-lineSpacing} rx={8} ry={8}/>
                {words.map((v, i) => 
                    <g key={`${v}, ${i}`} transform={`translate(${(maxWidth-Array.from(v).reduce((total, v)=>total + getWidth(v.toUpperCase(), height) + gap*height, 0))/2}, ${i*(height+lineSpacing)})`}>
                        <Wordify {...props} word={v} seed={seed+i*100} colorPalette={newColors} index={i}/>
                    </g>
                )}
            </svg>
    )
}

export function Wordify(props:WordifyProps) {
    const {height=100, colorPalette, word, seed, letterContrast, padding=0, gap=0.1, index=0} = props
    if (!word) return null
    let dist = 0
       return(Array.from(word).map((v,i)=> { 
            const pos = dist
            dist += getWidth(v.toUpperCase(), height) + gap*height
            return(
                <g key={`${v},${i}`} transform={`translate(${pos+padding}, ${padding}), scale(${height/getHeight(v.toUpperCase())})`} role="button" onClick={(e)=>mainFile.settings[mainFile.activeIndex].setSeedArray(index, i, e.shiftKey ? -73 : 73)}>
                    <Letterify2 name={v.toUpperCase()} seed={seed+i*100+props.seedArray[index][i]} palette={colorPalette} contrast={letterContrast}/>
                </g>
            )
        }))
}

export function getWidth(name:string, height:number):number {
    if (name===" ") return height/3.141592653589793238462643383279502884
    const activeLetter = betterLetters.find(v=>v.name === name)
    if (!activeLetter) return 0
    const bboxWidth = activeLetter.bbox.maxX-activeLetter.bbox.minX
    const bboxHeight = activeLetter.bbox.maxY-activeLetter.bbox.minY
    return (height*bboxWidth/bboxHeight + height/100)
}

export function getHeight(name:string):number {
    const activeLetter = betterLetters.find(v=>v.name===name)
    if (!activeLetter) return 1
    return activeLetter.bbox.maxY-activeLetter.bbox.minY
}