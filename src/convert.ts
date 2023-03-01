import wasmUrl from "@resvg/resvg-wasm/index_bg.wasm?url";
import { initWasm, Resvg } from "@resvg/resvg-wasm";

await initWasm(fetch(wasmUrl));

export function svgToPng(svg: string, width: number): Uint8Array {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });
  const image = resvg.render();
  const png = image.asPng();

  return png;
}

const pngSizes = {
  favicon: 32,
  appleTouchIcon: 180,
  androidChrome192: 192,
  androidChrome512: 512,
};

type PngImages = {
  [key in keyof typeof pngSizes]: Uint8Array;
};

export function svgToPngs(svg: string): PngImages {
  const pngs = {
    favicon: svgToPng(svg, pngSizes.favicon),
    appleTouchIcon: svgToPng(svg, pngSizes.appleTouchIcon),
    androidChrome192: svgToPng(svg, pngSizes.androidChrome192),
    androidChrome512: svgToPng(svg, pngSizes.androidChrome512),
  };

  return pngs;
}
