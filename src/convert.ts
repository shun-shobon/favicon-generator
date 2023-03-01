import wasmUrl from "@resvg/resvg-wasm/index_bg.wasm?url";
import { initWasm, RenderedImage, Resvg } from "@resvg/resvg-wasm";

await initWasm(fetch(wasmUrl));

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
