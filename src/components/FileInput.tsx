import { Box, Link, VStack, Spinner, Icon, Text } from "@chakra-ui/react";
import { ChangeEvent, DragEvent, useId, useState } from "react";
import { FiUpload } from "react-icons/fi";

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
    <VStack w="full" maxW="container.md" gap={4}>
      <Text px={4}>
        This tool will convert your SVG file into a favicon.{" "}
        <strong>All operations are performed in the browser,</strong> no files
        are uploaded to the server! This application is inspired by{" "}
        <Link
          href="https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs"
          color="teal.400"
        >
          "How to Favicon in 2023: Six files that fit most needs"
        </Link>
        .
      </Text>
      <VStack
        as="form"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragOver(false)}
        w="full"
        gap={4}
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
        {loading && (
          <VStack
            position="absolute"
            w="full"
            h="full"
            top={0}
            left={0}
            justify="center"
            bgColor="gray.50"
            marginTop={0}
          >
            <Spinner
              size="xl"
              thickness="4px"
              emptyColor="gray.200"
              color="teal.400"
            />
          </VStack>
        )}
        <input
          type="file"
          accept="image/svg+xml"
          id={inputId}
          hidden
          onChange={handleChange}
        />
        <Icon as={FiUpload} w={12} h={12} color="gray.400" />
        <Box>
          <Link as="label" htmlFor={inputId} color="teal.400" fontWeight={700}>
            Click to upload
          </Link>{" "}
          or drag and drop
        </Box>
      </VStack>
    </VStack>
  );
}
