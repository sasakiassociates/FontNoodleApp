import { computed, override } from 'mobx'
import {ExtendedModel, Model, model, modelAction, prop, undoMiddleware, getSnapshot, applySnapshot, detach, getParent} from 'mobx-keystone'
import { sasakiColors } from './FontNoodle/Storage'
import {EventEmitter} from '@strategies/react-events'

export type FileEvents = {
  savePreview: "svg" | "png"
}

@model("noodle/MainFile")
export class MainFile extends Model ({
  settings:prop<Settings[]>(()=>[]),
  activeIndex:prop<number>(0).withSetter(),
  tabsMade:prop<number>(1).withSetter()
}){
  @computed
  get activeSettings() {
    if (this.activeIndex > this.settings.length) throw "Invalid Index" 
    return this.settings[this.activeIndex]
  }
  @computed
  get isSaved() {
    const data = localStorage.getItem(`FontNoodle - ${this.activeIndex}`)
    if (!data) return false
    if (JSON.stringify(getSnapshot(this.settings[this.activeIndex])) === data) return true
  }
  @modelAction
  addSettings(settings:Settings){
    this.settings.push(settings)
    this.setActiveIndex(this.settings.length-1)
  }
  @modelAction
  addNewSettings() {
    this.setTabsMade(this.tabsMade + 1)
    this.addSettings(new Settings({tabName:`Noodle ${this.tabsMade}`}))
  }
  @modelAction
  addNewBlankSettings() {
    this.setTabsMade(this.tabsMade + 1)
    this.addSettings(new Settings({words: [""], tabName:`Noodle ${this.tabsMade}`}))
  }
  save(key:string) {
    localStorage.setItem(`${key} - ${this.activeIndex}`, JSON.stringify(getSnapshot(this.settings[this.activeIndex])))
  }
  @modelAction
  load(key:string){
    const data = localStorage.getItem(`${key} - ${this.activeIndex}`)
    if (!data) return
    applySnapshot(this.settings[this.activeIndex], JSON.parse(data))
  }
  @modelAction
  loadSettings(i:number) {
    this.setActiveIndex(i)
  }
}

@model("noodle/Settings")
export class Settings extends Model ({
    tabName:prop<string>("Noodle 1").withSetter(),
    seed:prop<number>(12345).withSetter(),
    seedArray:prop<number[][]>(()=>[[0,0,0,0,0,0]]),
    colorPalette:prop<[string, string[]]>(()=>sasakiColors).withSetter(),
    lines:prop<number>(1),
    words:prop<string[]>(()=>["Sasaki"]),
    bgColor:prop<string>("#ffffff").withSetter(),
    bgContrast:prop<number>(2).withSetter(),
    letterContrast:prop<number>(1).withSetter(),
    height:prop<number>(50).withSetter(),
    gap:prop<number>(0.1).withSetter(),
    padding:prop<number>(8).withSetter(),
    lineSpacing:prop<number>(8).withSetter(),
}){
    events = new EventEmitter<FileEvents>()
    savePreview(fileType:"svg"|"png") {
      this.events.emit("savePreview", fileType)
    } 
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

        // Resize Seed Array
        const nextArray = [...this.seedArray];
        if (nextArray.length < lines) {
          nextArray.push(...Array(lines - nextArray.length).fill([]));
        } else if (nextArray.length > lines) {
          nextArray.length = lines
        }
        this.seedArray = nextArray;
        this.words = next;
    } 
    @modelAction
    setWord(i:number, v:string) {
      if (i >= this.words.length) throw "Invalid Index"
      this.words[i] = v
      // Resize Seed Array
      const nextArray = [...this.seedArray[i]];
      if (nextArray.length < this.words[i].length) {
        nextArray.push(...Array(this.words[i].length - nextArray.length).fill(0));
      } else if (nextArray.length > this.words[i].length) {
        nextArray.length = this.words[i].length
      }
      this.seedArray[i] = nextArray;
      
    }
    @modelAction
    setSeedArray(line:number, letter:number, change=100) {
      if (line >= this.words.length) throw "Invalid Index (line)"
      if (letter >= this.words[line].length) throw "Invalid Index (word)"
      const arr = [...this.seedArray];
      arr[line] = [...arr[line]];
      arr[line][letter] = arr[line][letter] + change
      this.seedArray = arr
    }
    @modelAction
    remove(){
      const file = getParent(getParent(this)!) as MainFile
      file.setActiveIndex(0)
      detach(this)
    }
}
const defaultSettings = new Settings({})
export const mainFile = new MainFile({settings:[defaultSettings]})
export const undoManager = undoMiddleware(mainFile)