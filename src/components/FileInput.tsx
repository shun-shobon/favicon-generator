import { Box, Link, VStack } from "@chakra-ui/react";
import { ChangeEvent, DragEvent, useId, useState } from "react";
import { Spinner } from "@chakra-ui/react";

type Props = {
  loading: boolean;
  onFileSubmit: (file: File) => void;
};

export function FileInput({ loading, onFileSubmit }: Props): JSX.Element {
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "image/svg+xml") return;

    onFileSubmit(file);
  };

  const handleDrop = (event: DragEvent<HTMLFormElement & HTMLDivElement>) => {
    event.preventDefault();
    if (loading) return;

    const file = event.dataTransfer.files[0];
    if (!file || file.type !== "image/svg+xml") return;

    onFileSubmit(file);
  };

  const handleDragOver = (
    event: DragEvent<HTMLFormElement & HTMLDivElement>,
  ) => {
    event.preventDefault();
    setDragOver(true);
  };

  return (
    <Box
      as="form"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      w="full"
      maxW="container.md"
      px={10}
      py={20}
      textAlign="center"
      overflow="hidden"
      position="relative"
      bgColor={dragOver ? "teal.50" : "white"}
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
      {loading && (
        <VStack
          position="absolute"
          w="full"
          h="full"
          top={0}
          left={0}
          justify="center"
          bgColor="gray.100"
          marginTop={0}
        >
          <Spinner
            size="xl"
            thickness="4px"
            emptyColor="gray.200"
            color="gray.600"
          />
        </VStack>
      )}
      <Box>
        <Link as="label" htmlFor={inputId} color="teal.400" fontWeight={700}>
          Click to upload
        </Link>{" "}
        or drag and drop
      </Box>
    </Box>
  );
}
