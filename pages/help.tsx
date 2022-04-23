import {
  Box,
  Stack,
  Flex,
  Heading,
  Text,
  Container,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { groq } from "next-sanity";
import { getClient } from "../lib/sanity";
import Head from "next/head";

export default function FAQ({ data }: any) {
  if(!data) return null

  return (
    <>
      <Head>
        <title>Frequently Asked Questions</title>
      </Head>
      <Box pt={[10, 20]} bg="brand.platinum" color="black" w="full">
          <Container maxW="container.xl" py={20} centerContent>
            <Heading size="2xl">{data.heading}</Heading>
            <Text my={4}>{data.subheading}</Text>
            <Button variant="outline" _hover={{color: 'black', background: 'white'}}>Let&apos;s Chat</Button>
          </Container>
      </Box>
      <Box w="full" py={20}>
        <Container maxW="container.xl">
          <Stack direction={["column", "row"]} spacing={20}>
            <Text>{data.paragraphOne}</Text>
            <FaqAccordion faqs={data.faqs}/>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

function FaqAccordion({ faqs }: any) {
  return (
    <Accordion allowMultiple allowToggle minW="50%">
      {faqs.map((faq: any) => (
        <AccordionItem key={faq._id}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {faq.question}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>{faq.answer}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export async function getStaticProps() {
  const helpPageQuery = groq`*[_type == "help"]
  {...,
    faqs[]->
  }[0]`;

  const helpPageData = await getClient(false).fetch(helpPageQuery, {});

  return {
    props: {
      data: helpPageData,
    },
  };
}
