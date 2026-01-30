import chroma from "chroma-js";

export function Paletteable (props:{palette:string[], bgColor:string, contrast:number, columns?:number}) {
    const {palette, bgColor, contrast, columns=4} = props
    const goodColors = palette.map(v=> chroma.contrast(bgColor, v) > contrast ? true : false)
    return(
        <svg width={21.5*columns} height={22.5*Math.ceil(goodColors.length/columns)}>
            {goodColors.map((v,i)=>
                <rect key={`${i}, ${v}`} fill={v === true ? palette[i] : "#ffffff"} width={17.5} height={17.5} transform={`translate(${21.5*(i%columns)+1.5},${Math.floor(i/columns)*21.5+1.5})`} stroke={palette[i]} strokeWidth={3}/>
            )}
        </svg>
    )
}  