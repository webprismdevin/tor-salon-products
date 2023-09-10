import { Heading, Text } from "@chakra-ui/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  node: PortableTextBlock;
};

export default function Block({ children, node }: Props) {
  if (node.style === "h2") {
    return (
      <Heading as="h2" my={4}>
        {children}
      </Heading>
    );
  }

  // Paragraphs
  return <Text my={2}>{children}</Text>;
}
