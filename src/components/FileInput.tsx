import { Box, Link, VStack } from "@chakra-ui/react";
import { ChangeEvent, DragEvent, useId } from "react";

type Props = {
  onFileSubmit: (file: File) => void;
};

export function FileInput({ onFileSubmit }: Props): JSX.Element {
  const inputId = useId();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "image/svg+xml") return;

    onFileSubmit(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (!file || file.type !== "image/svg+xml") return;

    onFileSubmit(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <VStack
      as="form"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      p={20}
      borderWidth={2}
      borderStyle="dotted"
      borderRadius="lg"
    >
      <input
        type="file"
        accept="image/svg+xml"
        id={inputId}
        hidden
        onChange={handleChange}
      />
      <Box>
        <Link as="label" htmlFor={inputId} color="teal.500">
          Click to upload
        </Link>{" "}
        or drag and drop
      </Box>
    </VStack>
  );
}
