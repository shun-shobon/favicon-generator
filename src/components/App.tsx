import { VStack, Link } from "@chakra-ui/react";
import { FormControl, FormLabel, Button, Icon } from "@chakra-ui/react";
import { FileUpload } from "./FileUpload";
import { useForm } from "react-hook-form";
import { FiFile } from "react-icons/fi";
import { useRef } from "react";
import { svgToPng } from "~/convert";
import { createIco } from "~/ico";
import JSZip from "jszip";

const sizes = {
  favicon: 32,
  appleTouchIcon: 180,
  androidChrome192: 192,
  androidChrome512: 512,
};

type FormData = {
  file: FileList;
};

function App(): JSX.Element {
  const { register, handleSubmit } = useForm<FormData>();
  const downloadRef = useRef<HTMLAnchorElement>(null);

  const onSubmit = handleSubmit(async (data) => {
    const file = data.file[0];
    if (!file || !downloadRef.current) return;

    const svg = await file.text();

    const faviconPng = svgToPng(svg, sizes.favicon);
    const faviconIco = createIco(
      faviconPng.width,
      faviconPng.height,
      faviconPng.pixels,
    );

    const appleTouchIconPng = svgToPng(svg, sizes.appleTouchIcon).asPng();
    const androidChrome192Png = svgToPng(svg, sizes.androidChrome192).asPng();
    const androidChrome512Png = svgToPng(svg, sizes.androidChrome512).asPng();

    const zip = new JSZip();
    zip.file("icon.svg", svg);
    zip.file("favicon.ico", faviconIco);
    zip.file("apple-touch-icon.png", appleTouchIconPng);
    zip.file("android-chrome-192x192.png", androidChrome192Png);
    zip.file("android-chrome-512x512.png", androidChrome512Png);

    const content = await zip.generateAsync({ type: "blob" });
    downloadRef.current.href = URL.createObjectURL(content);
  });

  return (
    <VStack w="100wh" h="100vh" justify="center">
      <VStack as="form" onSubmit={onSubmit}>
        <FormControl>
          <FormLabel>Upload a file</FormLabel>
          <FileUpload accept="image/svg+xml" register={register("file")}>
            <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
          </FileUpload>
        </FormControl>
        <FormControl>
          <Button type="submit">Submit</Button>
        </FormControl>
      </VStack>

      <Link download ref={downloadRef}>
        ダウンロード
      </Link>
    </VStack>
  );
}

export default App;
