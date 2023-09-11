import {
  Box,
  Text,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
} from "@chakra-ui/react";
import { sanity } from "../lib/sanity";
import Head from "next/head";
import Modules from "../components/Modules/Modules";

export default function FAQ({ data }: any) {
  if (!data) return null;

  return (
    <>
      <Head>
        <title>Help &amp; FAQ | TOR Salon Products</title>
        <meta
          name="description"
          content="Get support and answers to many common questions. Contact us today."
        />
      </Head>
      <Box bg="brand.platinum" color="black" w="full">
        <Modules modules={data.page.modules} />
      </Box>
      <Box w="full" py={20}>
        <Container maxW="container.md">
            <FaqAccordion faqs={data.faqs}/>
        </Container>
      </Box>
    </>
  );
}

export function FaqAccordion({ faqs }: any) {
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
          <AccordionPanel py={4}>
            <Text>{faq.answer}</Text>
            {faq.link && <Link href={faq.link}>Learn more</Link>}
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export async function getStaticProps() {
  const helpPageQuery = `{
    'page': *[_type == "help"][0],
    'faqs': *[_type == "faq"]
  }`;

  const helpPageData = await sanity.fetch(helpPageQuery, {});

  return {
    props: {
      data: helpPageData,
    },
  };
}
