import React, { type RefObject, useCallback, useEffect, useRef, useState } from "react";

type AnyEvent = MouseEvent | TouchEvent

export const useOnClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: (event: AnyEvent) => void,
): void => {
    useEffect(() => {
        const listener = (event: AnyEvent) => {
            const el = ref?.current

            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(event.target as Node)) {
                return
            }

            handler(event)
        }

        document.addEventListener(`mousedown`, listener)
        document.addEventListener(`touchstart`, listener)

        return () => {
            document.removeEventListener(`mousedown`, listener)
            document.removeEventListener(`touchstart`, listener)
        }

        // Reload only if ref or handler changes
    }, [ref, handler])
};

export const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

export const hexToRgba = (hex: string, alpha = 1) => {
    const { r, g, b } = hexToRgb(hex);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const format = (number: number) => {
    const hex = number.toString(16);
    return hex.length < 2 ? "0" + hex : hex;
};

export const useTextWidth = (text: string, fontSize: string) => {
    const [textWidth, setTextWidth] = useState(0)

    useEffect(() => {
        // Create a temporary SVG element
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        )
        // Create a temporary text element
        const tempText = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        )
        tempText.setAttribute("font-size", fontSize)
        tempText.textContent = text
        svg.appendChild(tempText)
        document.body.appendChild(svg)

        const width = tempText.getBBox().width

        document.body.removeChild(svg)

        setTextWidth(width)
    }, [text, fontSize])

    return textWidth
}

export const useTooltip = (isActive:boolean) => {
    const [visible, setVisible] = useState(false);
    const [tooltipStyles, setTooltipStyles] = useState({});
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseOver = useCallback(() => {
        if (!isActive) return;

        setVisible(true);
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const tooltipPosition = rect.left < windowWidth / 2 ? 'left' : 'right';

            let top, bottom;

            const offsetY = 5;
            if (rect.bottom > window.innerHeight * 0.7) {
                // If it's near the bottom, then we position above
                bottom = (window.innerHeight - rect.top) + offsetY + 'px';
            } else {
                top = rect.bottom + window.scrollY + offsetY + 'px';
            }

            setTooltipStyles({
                top,
                bottom,
                left: tooltipPosition === 'left' ? rect.left + window.scrollX + 'px' : 'auto',
                right: tooltipPosition === 'right' ? windowWidth - rect.right + window.scrollX + 'px' : 'auto',
            });
        }
    }, [isActive]);

    const handleMouseOut = useCallback(() => {
        if (!isActive) return;

        setVisible(false);
    }, [isActive]);

    return {
        ref,
        visible,
        tooltipStyles,
        handleMouseOver,
        handleMouseOut,
    };
};
