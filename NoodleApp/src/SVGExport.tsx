import { useCallback, useRef } from "react";
import { IconButton, Button } from "@strategies/ui";
import { PiFileSvgBold, PiFilePngBold } from "react-icons/pi";
class SvgExtraction {
    private can: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null;
    private loader: HTMLImageElement;
    constructor() {
        this.can = document.createElement('canvas'); // Not shown on page
        this.ctx = this.can.getContext('2d');
        this.loader = new Image; // Not shown on page
        // this.downloadHelper = new DownloadHelper();
    }
    // Generate PNG data URL from SVG
    async convertToPng(svgNode: Node, svgSize: { w: number, h: number }, imgSize: {
        w: number,
        h: number
    }, x: number, y: number) {
        return new Promise<string>((resolve, reject) => {
            const svgAsXML = (new XMLSerializer).serializeToString(svgNode);
            this.loader.width = svgSize.w;
            this.can.width = imgSize.w;//mySVG.clientWidth;
            this.loader.height = svgSize.h;
            this.can.height = imgSize.h;// mySVG.clientHeight;
            this.loader.onload = () => {
                this.ctx!.drawImage(this.loader, x, y, imgSize.w, imgSize.h);//, this.loader.width, this.loader.height);
                const w = this.loader.width;
                const h = this.loader.height;
                resolve(this.can.toDataURL());
            };
            this.loader.src = 'data:image/svg+xml,' + encodeURIComponent(svgAsXML);
        })
    }
}
function downloadBlob(blob: any, filename: string) {
    const objectUrl = URL.createObjectURL(blob);
    downloadObjectUrl(objectUrl, filename);
}
function downloadObjectUrl(objectUrl: string, filename: string, mimeType?: string) {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    if (mimeType) {
        link.dataset.downloadurl = [mimeType, link.download, link.href].join(':');
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
}
type SvgDownloadableProps = {
    fileName: string,
    pngScale: number,
    children?: React.ReactNode;
};
export const SvgDownloadable = ({ fileName, pngScale, children }: SvgDownloadableProps) => {
    const svgRef = useRef<HTMLDivElement>(null);
    const downloadSVG = useCallback(() => {
        const svg = svgRef.current!.innerHTML;
        const blob = new Blob([svg], { type: "image/svg+xml" });
        downloadBlob(blob, fileName + '.svg');
    }, []);
    const downloadPNG = useCallback(() => {
        const svgParent = svgRef.current;
        if (!svgParent) return;
        const svg = svgParent.firstChild as SVGElement;
        const svgSize = { w: svg.clientWidth, h: svg.clientHeight };
        const imgSize = { w: svg.clientWidth * pngScale, h: svg.clientHeight * pngScale };
        (async () => {
            const pngData = await new SvgExtraction().convertToPng(svg, svgSize, imgSize, 0, 0);
            downloadObjectUrl(pngData, fileName + '.png', 'image/png');
        })();
    }, []);
    return <div className={'SvgDownloadable'}>
        <div ref={svgRef}>
            {children}
        </div>
        <div className={'button-container'}>
            <IconButton icon={<PiFileSvgBold />} onClick={downloadSVG} />
            <IconButton icon={<PiFilePngBold />} onClick={downloadPNG} />
        </div>
    </div>
};









