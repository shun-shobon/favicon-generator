import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import html from "react-syntax-highlighter/dist/esm/languages/prism/markup";
import { nord } from "react-syntax-highlighter/dist/esm/styles/prism";
import { VStack, Heading, Text, Link, Box } from "@chakra-ui/react";
import headHtml from "~/assets/favicon.html?raw";
import { useEffect, useRef } from "react";

SyntaxHighlighter.registerLanguage("html", html);

type Props = {
  data: Blob;
};

export function Success({ data }: Props): JSX.Element {
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
    <Box p={4}>
      <Heading>Success!</Heading>
      <Text>
        <Link ref={linkRef}>Click to download</Link> favicons zip file.
      </Text>
      <Text>
        Add the following code to the <code>{"<head>"}</code> tag of your HTML
        file.
      </Text>
      <SyntaxHighlighter language="html" style={nord}>
        {headHtml}
      </SyntaxHighlighter>
    </Box>
  );
}
