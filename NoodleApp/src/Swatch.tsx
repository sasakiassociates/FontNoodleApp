import React, { type MouseEventHandler } from "react";
import ReactDOM from "react-dom";
import { useTooltip } from "./helpers";

export const Swatch = ({ color, tooltip, onClick, onDoubleClick }: {
    color: string,
    tooltip?: React.ReactNode,
    onClick?: (event: React.MouseEvent) => void
    onDoubleClick?: (event: React.MouseEvent) => void
}) => {
    const { ref, visible, tooltipStyles, handleMouseOver, handleMouseOut } = useTooltip(!!tooltip);

    return <>
        <div className="Swatch"
             onMouseOver={handleMouseOver}
             onMouseOut={handleMouseOut}
             ref={ref}
             onDoubleClick={onDoubleClick}
             onClick={onClick} style={{ backgroundColor: color }}/>
        {visible && ReactDOM.createPortal(
            <div className={'tooltip'} style={tooltipStyles}>
                {tooltip}
            </div>,
            document.body
        )}
    </>
};
