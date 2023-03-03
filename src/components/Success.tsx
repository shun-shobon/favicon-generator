import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import html from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Heading, Text, Link, Box } from "@chakra-ui/react";
import headHtml from "~/assets/favicon.html?raw";
import { useEffect, useRef } from "react";

SyntaxHighlighter.registerLanguage("html", html);

type Props = {
  data: Blob;
  onOneMore: () => void;
};

export function Success({ data, onOneMore }: Props): JSX.Element {
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    link.href = URL.createObjectURL(data);
    link.download = "favicons.zip";

    return () => {
      URL.revokeObjectURL(link.href);
    };
  });

  return (
    <Box w="full" maxW="container.md" mx="auto" textAlign="center">
      <Heading>Success!</Heading>
      <Text>
        <Link ref={linkRef} color="teal.400" fontWeight={700}>
          Click to download
        </Link>{" "}
        favicons zip file.
      </Text>
      <Text>
        Add the following code to the <code>{"<head>"}</code> tag of your HTML
        file.
      </Text>
      <SyntaxHighlighter
        language="html"
        style={nord}
        showLineNumbers
        customStyle={{ maxWidth: "100%" }}
      >
        {headHtml.trim()}
      </SyntaxHighlighter>
      <Link color="teal.400" fontWeight={700} onClick={onOneMore}>
        One more?
      </Link>
    </Box>
  );
}
