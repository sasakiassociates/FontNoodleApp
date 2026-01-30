import { computed, override } from 'mobx'
import {ExtendedModel, Model, model, modelAction, prop} from 'mobx-keystone'
import { sasakiColors } from './FontNoodle/Storage'

@model("noodle/Settings")
export class Settings extends Model ({
    seed:prop<number>(12345).withSetter(),
    colorPalette:prop<[string, string[]]>(()=>sasakiColors).withSetter(),
    lines:prop<number>(1),
    words:prop<string[]>(()=>["Sasaki"]),
    bgColor:prop<string>("#ffffff").withSetter(),
    bgContrast:prop<number>(2).withSetter(),
    letterContrast:prop<number>(1).withSetter(),
    height:prop<number>(50).withSetter(),
    gap:prop<number>(0.1).withSetter(),
    padding:prop<number>(8).withSetter(),
    lineSpacing:prop<number>(8).withSetter()
}){
    @modelAction
    setLines(lines: number) {
        this.lines = lines;

        // Resize words array
        const next = [...this.words];

        if (next.length < lines) {
          next.push(...Array(lines - next.length).fill(""));
        } else if (next.length > lines) {
          next.length = lines;
        }

        this.words = next;
    } 
    @modelAction
    setWord(i:number, v:string) {
      if (i >= this.words.length) throw "Invalid Index"
      this.words[i] = v
    }
}

export const mainSettings = new Settings({})