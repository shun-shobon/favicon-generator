import { VStack, Link } from "@chakra-ui/react";
import { FormControl, FormLabel, Button, Icon } from "@chakra-ui/react";
import { FileUpload } from "./FileUpload";
import { useForm } from "react-hook-form";
import { FiFile } from "react-icons/fi";
import { useRef } from "react";
import { process } from "~/convert";

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

  const onSubmit = handleSubmit((data) => {
    const file = data.file[0];
    if (!file) return;

    file
      .text()
      .then((svg) => process(svg))
      .then((zip) => {
        if (!downloadRef.current) return;
        downloadRef.current.href = URL.createObjectURL(zip);
      });
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
