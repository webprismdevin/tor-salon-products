import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
} from "@chakra-ui/react";
import type { PortableTextBlock } from "@portabletext/types";
import PortableText from "../PortableText";

type Props = {
  node: any;
};

export default function AccordionBlock({ node }: Props) {
  return (
    <Accordion allowToggle my={8}>
      {node?.groups?.map((group:any) => (
        <AccordionItem key={group._key}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {group.title}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <PortableText blocks={group.body} />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}