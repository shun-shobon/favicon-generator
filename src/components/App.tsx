import { VStack, Image } from "@chakra-ui/react";
import { FormControl, FormLabel, Button, Icon } from "@chakra-ui/react";
import { FileUpload } from "./FileUpload";
import { useForm } from "react-hook-form";
import { FiFile } from "react-icons/fi";
import { useRef } from "react";
import { svgToPng } from "~/convert";
import { createIco } from "~/ico";
// import init, { to_ico } from "~/../ico/pkg/ico";

const pngSizes = {
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
  const imageRef = useRef<HTMLImageElement>(null);

  const onSubmit = handleSubmit(async (data) => {
    const file = data.file[0];
    if (!file || !imageRef.current) return;

    const svg = await file.text();
    const image = svgToPng(svg, 32);

    // const png = image.asPng();
    // const pngBlob = new Blob([png], { type: "image/png" });
    // const pngUrl = URL.createObjectURL(pngBlob);

    const ico = createIco(image.width, image.height, image.pixels);
    const icoBlob = new Blob([ico], { type: "image/x-icon" });
    const icoUrl = URL.createObjectURL(icoBlob);
    imageRef.current.src = icoUrl;
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

      <Image ref={imageRef} />
    </VStack>
  );
}

export default App;
