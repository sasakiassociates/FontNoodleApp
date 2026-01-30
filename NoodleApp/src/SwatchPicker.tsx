import React, { useRef, useState } from "react";
import { Swatch } from "./Swatch";
import { RgbaColorPicker, type RgbaColor, type RgbColor, HexColorPicker } from "react-colorful";//NOTE: I would like to use ColorPicker from "@strategies/ui" but it's throwing a bunch of errors
import { hexToRgb, useOnClickOutside } from "./helpers";
import ReactDOM from "react-dom";
import { PiEyedropperFill } from "react-icons/pi";
import { Button, IconButton } from "@strategies/ui";

const format = (number: number) => {
    const hex = number.toString(16);
    return hex.length < 2 ? "0" + hex : hex;
};

const rgbaToHex = ({ r, g, b }: RgbColor): string => {
    return "#" + format(r) + format(g) + format(b);
};

type SwatchPickerProps = {
    color: string,
    setColor: (color: string) => void,
    alpha?: number,
    resetButtonText?: string,
    resetButtonAction?: () => void,
    setAlpha?: (alpha: number) => void,
    optionalIncludes?: {
        hexInput: boolean,
        eyedropper: boolean,
        html5ColorInput: boolean,
    }
};

export const SwatchPicker = ({
                                 color,
                                 setColor,
                                 alpha,
                                 setAlpha,
                                 resetButtonText,
                                 resetButtonAction,
                                 optionalIncludes = {
                                     eyedropper: true,
                                     hexInput: true,
                                     html5ColorInput: false
                                 }
                             }: SwatchPickerProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [position, setPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const wrapperRef = useRef(null);

    const handleClickOutside = () => {
        setOpen(false);
    }

    let pickerColor: RgbaColor;
    const { r, g, b } = hexToRgb(color);
    pickerColor = {
        r, g, b, a: 1
    };
    if (alpha !== undefined && alpha !== 1) {
        pickerColor.a = alpha;
    }

    useOnClickOutside(wrapperRef, handleClickOutside);

    const handleSwatchClick = (event: React.MouseEvent) => {
        const { clientX, clientY, view } = event;
        const { innerWidth, innerHeight } = window;

        // Calculate the picker position
        const pickerWidth = 220; // estimated width of the color picker
        const pickerHeight = 250; // estimated height of the color picker

        const left = (clientX + pickerWidth > innerWidth) ? clientX - pickerWidth : clientX;
        const top = (clientY + pickerHeight > innerHeight) ? clientY - pickerHeight : clientY;

        setPosition({ top, left });
        setOpen(true);
    };


    const handleHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setColor(event.target.value);
    };

    const colorInputPick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const color = event.target.value;
        setColor(color);
    };

    const handleScreenColorPick = async () => {
        if ('EyeDropper' in window) {
            try {
                const eyeDropper = new (window as any).EyeDropper();
                const result = await eyeDropper.open();
                setColor(result.sRGBHex);
            } catch (error) {
                console.error('Error using the EyeDropper API:', error);
            }
        } else {
            alert('EyeDropper API is not supported in your browser.');
        }
    };

    return (
        <div className="SwatchPicker">
            <Swatch color={color} onClick={handleSwatchClick}/>
            {open && ReactDOM.createPortal(
                <div className="picker-open" ref={wrapperRef} style={{
                    position: 'absolute',
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    zIndex: 1000,
                    background: 'white',
                    padding: '10px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
                }}>
                    {resetButtonText && resetButtonAction &&
                        <div><Button onClick={() => resetButtonAction()}>{resetButtonText}</Button></div>}
                    {!setAlpha ? <>
                        <HexColorPicker color={color}
                                        onChange={(value: string) => {
                                            setColor(value);
                                        }}/>
                    </> : <>
                        <RgbaColorPicker
                            color={pickerColor}
                            onChange={(color: RgbaColor) => {
                                setColor(rgbaToHex(color));
                                if (setAlpha) setAlpha(color.a);
                            }}
                        />
                    </>}
                    {(optionalIncludes?.hexInput || optionalIncludes?.html5ColorInput || optionalIncludes?.eyedropper) &&
                        <div style={{ marginTop: '10px', display: 'flex' }}>
                            {optionalIncludes?.hexInput && <input
                                type="text"
                                value={color}
                                onChange={handleHexChange}
                                style={{ width: '70%', padding: '5px', marginBottom: '10px' }}
                                placeholder="Hex Color"
                            />
                            }
                            {optionalIncludes?.eyedropper &&
                                <IconButton icon={<PiEyedropperFill/>} labelText={'Eyedropper'} onClick={() => handleScreenColorPick()}/>
                            }
                            {optionalIncludes?.html5ColorInput && <input
                                type="color"
                                value={color}
                                onChange={colorInputPick}
                                style={{ width: '30px', padding: '5px' }}
                            />
                            }
                        </div>
                    }

                </div>,
                document.body
            )}
        </div>
    );
};

