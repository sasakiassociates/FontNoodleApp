import {FontNoodleSVG} from './FontNoodle/FontNoodle.tsx'
import "./App.css"
import { Paletteable } from './FontNoodle/Palette.tsx'
import {mainFile, undoManager} from "./DataStorage.ts"
import {observer} from "mobx-react-lite"
import {getSnapshot, applySnapshot} from "mobx-keystone"
import { AccordionStandard, BaseIcon, Body, Button, ColorField, IconButton, InputoutputPill, NumberField, Panel, Slider, TextField, Title } from '@strategies/ui'
import { PiArrowUUpLeftBold, PiArrowUUpRightBold, PiFilePngBold, PiFileSvgBold, PiFloppyDiskBold, PiFolderOpenBold, PiGearBold, PiInfoBold, PiLightbulbBold, PiPaletteBold, PiPlusBold, PiShapesBold, PiSlidersHorizontalBold, PiTextAaBold, PiTrashBold, PiUserBold} from "react-icons/pi"
import { colorPalettes } from './FontNoodle/Storage.tsx'
import { SwatchPicker } from './SwatchPicker.tsx'
import chroma from "chroma-js"
import { SvgDownloadable } from './SVGExport.tsx'


function NoodleTheFonts() {
  const now = new Date();
  const settings = mainFile.activeSettings
  const {words, bgColor, seed, bgContrast, letterContrast, colorPalette, padding} = settings
  return (<>
    <div className="TopBar">
      <div className="Row">
        <FontNoodleSVG words={["FontNoodle"]} seed={now.getHours()} colorPalette={colorPalettes[0][1]} height={35} bgColor={"#050038"} padding={8} seedArray={[[0,0,0,0,0,0,0,0,0,0]]}/>
        <BaseIcon icon={<PiShapesBold />} indicatorIconCount={mainFile.settings.length}></BaseIcon>
        {mainFile.settings.map((v,i)=><>
          <Button type={mainFile.activeIndex === i ? "primary":"secondary"} onClick={()=>mainFile.setActiveIndex(i)}>{v.tabName}</Button></>)}
        <Button leftIcon={<PiPlusBold/>} onClick={()=>mainFile.addNewBlankSettings()} type="discovery">New Noodle</Button>
      </div>
    </div>
    <div className="Container">
      <section className="SideBar">
        <IconButton icon={<PiInfoBold />} tooltip="Info" tooltipPosition="right"/>
        <IconButton icon={<PiGearBold />} tooltip="Settings" tooltipPosition="right"/>
        <IconButton icon={<PiFloppyDiskBold/>} onClick={()=>mainFile.save("FontNoodle")} tooltip="Save" tooltipPosition='right' indicatorIconCount={mainFile.isSaved ? 0 : 1}/>
        <IconButton icon={<PiFolderOpenBold/>} onClick={()=>mainFile.load("FontNoodle")} tooltip="Load" tooltipPosition="right"></IconButton>
        <IconButton icon={<PiArrowUUpLeftBold/>} onClick={()=>undoManager.undo()}/>
        <div className="BottomButtonInSideBar">
        <IconButton icon={<PiArrowUUpRightBold/>} onClick={()=>undoManager.redo()}/>
        </div>
        <IconButton icon={<PiUserBold />} />
      </section>
      <Panel className="Preview" icon={<PiTextAaBold />}>
        <Title>
          <div className="Row">
            <p className="HeaderText">Preview</p>
            <IconButton icon={<PiFileSvgBold/>} onClick={()=>settings.savePreview("svg")} tooltip="Download SVG"></IconButton>
            <IconButton icon={<PiFilePngBold/>} onClick={()=>settings.savePreview("png")} tooltip="Download PNG"></IconButton>
          </div>
        </Title>
        <Body>
          {/* {settings.seedArray.join(", ")} */}
        <SvgDownloadable fileName={`${words.join("")}Noodle`} pngScale={5} emitter={settings.events}><FontNoodleSVG 
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
          seedArray={settings.seedArray}
        /></SvgDownloadable></Body>
      </Panel>
        <section className="PanelColumn">
      <Panel icon={<PiGearBold/>} isIconAIconButton={true}>
          <Title>Noodle</Title>
          <Body>
            <section className="controls">
            <TextField title="Preset Name" onChange={v=>settings.setTabName(v)} value={settings.tabName}></TextField>
            <Button leftIcon={<PiTrashBold/>} type="alert" disabled={mainFile.settings.length === 1} onClick={()=>{mainFile.settings[mainFile.activeIndex].remove(); mainFile.settings.map((_,i)=>{mainFile.setActiveIndex(i); mainFile.save("FontNoodle")}); mainFile.setActiveIndex(0)}}>Delete Noodle</Button>
            </section>
          </Body>
      </Panel>
      <Panel icon={<PiTextAaBold/>} isIconAIconButton={true}>
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
      <Panel icon={<PiPaletteBold/>} isIconAIconButton={true}>
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
        <div className="Row" style={{ maxWidth: "300px", flexWrap: "wrap" }}>
          <PiLightbulbBold />
          <div className="TextDiv"><p className="figtree-fonting">Click on a letter to change only its colors.</p>
          <p className="figtree-fonting">Shift+click to undo.</p></div>
        </div>
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
        <div className="controls" style={{gap: "0px"}}>
        <div>
          <p>Background Contrast Ratio</p>
          <Slider min={1} max={4.5} step={0.01} onChange={v=>settings.setBgContrast(v)} value={bgContrast}/>
        </div>
        <div>
          <p>Available Colors:</p>
          <Paletteable bgColor={bgColor} palette={colorPalette[1]} contrast={bgContrast}/>
        </div>
        <div>
          <p>Letter Contrast Ratio</p>
          <Slider min={1} max={4.5} step={0.01} onChange={v=>settings.setLetterContrast(v)} value={letterContrast}/>
        </div></div></Body></AccordionStandard>
      </section>
      </Body>
      </Panel>
      <Panel icon={<PiSlidersHorizontalBold/>} isIconAIconButton={true}>
        <Title>Formatting</Title>
        <Body>
          <section className="controls">
        <div>
          <p className="figtree-fonting">Height (px)</p>
          <Slider value={settings.height} min={10} max={200} step={1} onChange={v=>settings.setHeight(v)} />
        </div>
        <div>
          <p className="figtree-fonting">Letter Spacing (%)</p>
          <Slider min={0.01} max={1} step={0.001} onChange={v=>settings.setGap(v)} value={settings.gap}/>
        </div>
        <div>
          <p className="figtree-fonting">Line Spacing (px)</p>
          <Slider min={1} max={50} step={0.1} onChange={v=>settings.setLineSpacing(v)} value={settings.lineSpacing}/>
        </div>
        </section>
        </Body>
      </Panel>
      </section>
      </div>
  </>)
}

export default observer(NoodleTheFonts)