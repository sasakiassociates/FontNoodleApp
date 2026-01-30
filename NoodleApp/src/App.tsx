import {FontNoodleSVG} from './FontNoodle/FontNoodle.tsx'
import "./App.css"
import { Paletteable } from './FontNoodle/Palette.tsx'
import {mainSettings} from "./DataStorage.ts"
import {observer} from "mobx-react-lite"
import {getSnapshot, applySnapshot} from "mobx-keystone"
import { AccordionStandard, Body, Button, ColorField, IconButton, InputoutputPill, NumberField, Panel, Slider, TextField, Title } from '@strategies/ui'
import {PiFileSvgBold, PiGearBold, PiPaletteBold, PiSlidersHorizontalBold, PiTextAaBold} from "react-icons/pi"
import { colorPalettes } from './FontNoodle/Storage.tsx'
import { SwatchPicker } from './SwatchPicker.tsx'
import chroma from "chroma-js"
import { SvgDownloadable } from './SVGExport.tsx'


function NoodleTheFonts() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const settings = mainSettings
  const {words, bgColor, seed, bgContrast, letterContrast, colorPalette, padding} = settings
  function saveSettings() {
    localStorage.setItem("settings", JSON.stringify(getSnapshot(settings)))
  }
  function loadSettings() {
    const data = localStorage.getItem("settings")
    if (!data) return
    const newSettings = JSON.parse(data)
    applySnapshot(settings, newSettings)
  }
  return (<>
    <div className="Logo"><FontNoodleSVG words={["FontNoodle"]} seed={dayOfYear} colorPalette={colorPalettes[0][1]} height={35} bgColor={"#050038"} padding={8} /></div>
    <div className="Container">
      <Panel icon={<PiTextAaBold />}>
        <Title>
          <div className="Row">
            <p>Preview</p>
          </div>
        </Title>
        <SvgDownloadable fileName={`${words.join(" ")} Noodle`} pngScale={5}><FontNoodleSVG 
          words={words}
          colorPalette={colorPalette[1]} 
          seed={seed} 
          bgColor={bgColor} 
          padding={padding} 
          bgContrast={bgContrast} 
          letterContrast={letterContrast}
          height={settings.height}
          gap={settings.gap}
          lineSpacing={settings.lineSpacing}
        /></SvgDownloadable>
      </Panel>
      <div className="PanelColumn">
      <Panel icon={<PiGearBold/>}>
      <Title>
        <section className="Row">
        <p>Settings</p>
        <Button onClick={()=>saveSettings()}>Save</Button>
        <Button onClick={()=>loadSettings()}>Load Previous</Button>
        </section>
      </Title>
      </Panel>
      <Panel className="LinesPanel" icon={<PiTextAaBold/>}>
        <Title>Text</Title>
        <Body>
          <section className="controls">
          <section className="Row">
            <NumberField onChange={v=>settings.setLines(v)} value={settings.lines} title="Number of Lines"/>
            <Button onClick={()=>settings.setLines(settings.lines+1)}>+</Button>
            <Button onClick={()=>settings.setLines(settings.lines-1)}>-</Button>
          </section>
          {words.map((e,i)=>
            <TextField
              key={i}
              type="text" 
              onChange={v=>settings.setWord(i, v)}
              value={e}
              title={i===0?"Preview Text":""}
              supportTitle={`Line ${i+1}`}
            />
          )}
          </section>
        </Body>
      </Panel>
      <Panel className="LinesPanel" icon={<PiPaletteBold/>}>
      <Title>Colors</Title>
      <Body>
      <section className="controls">
        <div className="Row">
          <SwatchPicker color={settings.bgColor} setColor={(v) => settings.setBgColor(v)}/>
          <ColorField name="Background Color" onChange={v=>settings.setBgColor(v)} value={bgColor} title="Background Color"/>
          <Button onClick={()=>settings.setBgColor(chroma.random().hex())}>Random</Button>
        </div>
        <section className="Row">
          <NumberField onChange={v=>settings.setSeed(v)} value={seed} title="Seed"/>
          <Button onClick={()=>settings.setSeed(Math.floor(Math.random()*1000000))}>Randomise Seed</Button>
        </section>
        <InputoutputPill
          title="Palette"
          options={[{children:colorPalettes.map(v=>v[0]), group:""}]}
          value={colorPalette[0]}
          onChange={(v: string) => {
            const palette = colorPalettes.find(([name]) => name === v)

            if (palette) {
              settings.setColorPalette([v, palette[1]])
            }
          }}
          hasClearButton={false}
          isPill={false}
        />
        <AccordionStandard >
        <Title>Complex Settings</Title>
        <Body>
        <section className="controls">
        <section>
          <p>Background Contrast Ratio</p>
          <Slider min={1} max={4.5} step={0.01} onChange={v=>settings.setBgContrast(v)} value={bgContrast}/>
        </section>
        <section>
          <p>Available Colors:</p>
          <Paletteable bgColor={bgColor} palette={colorPalette[1]} contrast={bgContrast}/>
        </section>
        <section>
          <p>Letter Contrast Ratio</p>
          <Slider min={1} max={4.5} step={0.01} onChange={v=>settings.setLetterContrast(v)} value={letterContrast}/>
        </section></section></Body></AccordionStandard>
      </section>
      </Body>
      </Panel>
      <Panel icon={<PiSlidersHorizontalBold/>}>
        <Title>Formatting</Title>
        <Body>
          <section className="controls">
        <div>
          <p>Height (px)</p>
          <Slider value={settings.height} min={10} max={200} step={1} onChange={v=>settings.setHeight(v)} />
        </div>
        <div>
          <p>Letter Spacing (%)</p>
          <Slider min={0.01} max={1} step={0.001} onChange={v=>settings.setGap(v)} value={settings.gap}/>
        </div>
        <div>
          <p>Line Spacing (px)</p>
          <Slider min={1} max={50} step={0.1} onChange={v=>settings.setLineSpacing(v)} value={settings.lineSpacing}/>
        </div>
        </section>
        </Body>
      </Panel>
      </div>
      
      
      
    </div>
  </>)
}

export default observer(NoodleTheFonts)