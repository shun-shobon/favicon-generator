import wasmUrl from "@resvg/resvg-wasm/index_bg.wasm?url";
import {
  initWasm,
  Resvg,
  type RenderedImage,
  type BBox,
} from "@resvg/resvg-wasm";
import JSZip from "jszip";
import { createIco } from "./ico";

await initWasm(fetch(wasmUrl));

export async function process(svg: string): Promise<Blob> {
  const bBox = new Resvg(svg).getBBox()!;
  const crop = getSquareCrop(bBox);

  const resvg = new Resvg(svg, {
    crop: crop,
  });
  const rendered = resvg.render();
  const image = await createImage(rendered);

  const faviconCanvas = resizeImage(image, 32);
  const pixels = faviconCanvas
    .getContext("2d")!
    .getImageData(0, 0, 32, 32).data;
  const favicon = createIco(32, 32, pixels);

  const appleTouchIcon = await canvasToPng(resizeImage(image, 180));
  const androidChrome192 = await canvasToPng(resizeImage(image, 192));
  const androidChrome512 = await canvasToPng(resizeImage(image, 512));

  const zip = new JSZip();
  zip.file("icon.svg", svg);
  zip.file("favicon.ico", favicon);
  zip.file("apple-touch-icon.png", appleTouchIcon);
  zip.file("android-chrome-192x192.png", androidChrome192);
  zip.file("android-chrome-512x512.png", androidChrome512);

  const blob = await zip.generateAsync({ type: "blob" });
  return blob;
}

function createImage(image: RenderedImage): Promise<HTMLImageElement> {
  const blob = new Blob([image.asPng()], { type: "image/png" });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.src = url;
  return new Promise((resolve) => {
    img.onload = () => {
      // URL.revokeObjectURL(url);
      resolve(img);
    };
  });
}

function getSquareCrop(box: BBox): {
  left: number;
  top: number;
  right: number;
  bottom: number;
} {
  const { width, height } = box;
  const size = Math.max(width, height);

  const left = (width - size) / 2;
  const top = (height - size) / 2;
  const right = left;
  const bottom = top;

  return { left, top, right, bottom };
}

function resizeImage(image: HTMLImageElement, size: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0, size, size);

  return canvas;
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        }
        reject(new Error("Failed to convert canvas to blob"));
      },
      "image/png",
      0.8,
    );
  });
}

export function svgToPng(svg: string, width: number): RenderedImage {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });
  const image = resvg.render();
  return image;
}
