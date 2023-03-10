import { Heading, Link, VStack, Text } from "@chakra-ui/react";
import { FileInput } from "./FileInput";
import { Success } from "./Success";
import { useState } from "react";
import { process } from "~/convert";

function App(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Blob | null>(null);

  const handleFileSubmit = (file: File) => {
    const p = async () => {
      const svg = await file.text();
      const data = await process(svg);
      return data;
    };

    setLoading(true);
    p()
      .then((data) => setData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleOneMore = () => {
    setData(null);
  };

  return (
    <VStack w="full" h="100dvh" justify="center" p={4} gap={4}>
      <Heading
        as="h1"
        fontSize={{ base: "4xl", md: "6xl" }}
        bgGradient="linear(to-r, teal.400,blue.400)"
        bgClip="text"
      >
        SVG Favicon Generator
      </Heading>
      {data && !loading ? (
        <Success data={data} onOneMore={handleOneMore} />
      ) : (
        <FileInput loading={loading} onFileSubmit={handleFileSubmit} />
      )}
      <Text fontSize="sm" color="gray.500">
        Copyright © 2023{" "}
        <Link target="_blank" href="https://s2n.tech" color="teal.400">
          Shuntaro Nishizawa (しゅん🌙)
        </Link>
      </Text>
    </VStack>
  );
}

export default App;
