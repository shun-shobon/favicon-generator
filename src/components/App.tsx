import { VStack } from "@chakra-ui/react";
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

  return (
    <VStack w="100wh" h="100vh" justify="center" p={4}>
      {loading ? (
        <div>Loading...</div>
      ) : data ? (
        <Success data={data} />
      ) : (
        <FileInput onFileSubmit={handleFileSubmit} />
      )}
    </VStack>
  );
}

export default App;
