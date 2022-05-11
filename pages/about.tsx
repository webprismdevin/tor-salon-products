import {
  Box,
  Flex,
  Text,
  Container,
  Heading,
  Image,
  Divider,
  Stack,
  Button,
  Link,
} from "@chakra-ui/react";
import { groq } from "next-sanity";
import { getClient } from "../lib/sanity";
import Head from "next/head";
import dynamic from "next/dynamic";
import { PortableText } from "@portabletext/react";

const Follow = dynamic(() => import("../components/Follow"), { ssr: false });

type AboutPageData = {
  data: {
    mainHeading: string;
    mainParagraph: [];
    secTwoHeading: string;
    secTwoParagraph: [];
    secThreeParagraph: [];
    secThreeHeading: string;
    secThreeButtonText: string;
    secThreeButtonLink: string;
    secThreeButtonTarget: string;
    secFourHeading: string;
    secFourColOneParagraph: [];
    secFourColTwoHeading: string;
    secFourColTwoParagraph: [];
    secFiveHeading: string;
    secFiveParagraph: [];
  };
};

const blockContentComponents = {
  types: {
    p: ({ value }: any) => <Text>{value.text}</Text>,
  },
};

const About = ({ data }: AboutPageData) => {
  return (
    <>
      <Head>
        <title>About Us | TOR Salon Products</title>
        <meta
          name="description"
          content="TOR is driven by science, not marketing - we formulate our products
            not to work for the most people, but to work for people the most.
            Started in 2014 by beauty industry veteran Shannon Tor, a former
            Avon &amp; Alberto-Culver product chemist with 9 industry awards,
            TOR's philosophy is simple: “no half-measures”."
        />
      </Head>
      <Box pos="relative" h={["auto", 1200]}>
        <Stack
          spacing={6}
          pl={[8, 20]}
          pr={[8, 0]}
          py={[20, 40]}
          pos="relative"
          zIndex={1}
        >
          <Heading
            as="h1"
            size="lg"
            textTransform={"uppercase"}
            fontFamily="Futura"
          >
            About Us
          </Heading>
          <Heading as="h2" fontSize={["60px", "84px"]}>
            {data.mainHeading}
          </Heading>
          <Stack maxW="480px" spacing={6}>
            <PortableText
              components={blockContentComponents}
              value={data.mainParagraph}
            />
          </Stack>
        </Stack>
        <Image
          pos={["static", "absolute"]}
          right={0}
          top={40}
          pt={[20, 0]}
          src="/images/about/Tor-family.png"
          alt="Tor family"
          pl={[4, 0]}
        />
        <Stack spacing={6} pl={[8, 20]} pr={[8, 0]} py={[0, 40]}>
          <Heading>{data.secTwoHeading}</Heading>
          <Stack maxW="480px" spacing={6}>
            <PortableText
              components={blockContentComponents}
              value={data.secTwoParagraph}
            />
          </Stack>
        </Stack>
      </Box>
      <Box pos="relative" h={["auto", 1500]} py={[40, 0]}>
        <Image
          pos={["static", "absolute"]}
          left={0}
          top={[0, 40]}
          src="/images/about/about-cbd.png"
          alt="Tor family"
          pr={[4, 0]}
        />
        <Stack
          spacing={6}
          pl={[8, 20]}
          pr={[8, 0]}
          py={[20, 480]}
          pos={["static", "absolute"]}
          right={20}
          align="flex-start"
        >
          <Heading>{data.secThreeHeading}</Heading>
          <Stack maxW="480px" spacing={6}>
            <PortableText
              components={blockContentComponents}
              value={data.secThreeParagraph}
            />
          </Stack>
          <Link href={data.secThreeButtonLink} target={data.secThreeButtonTarget ? data.secThreeButtonTarget : "_self"}>
            <Button>{data.secThreeButtonText}</Button>
          </Link>
        </Stack>
      </Box>
      <Container maxW="container.xl" mt={[-20, 0]} pt={[0]}>
        <Stack spacing={12} align="center">
          <Heading textAlign={"center"}>Who We Serve</Heading>
          <Divider maxW={400} />
          <Flex
            flexDir={["column", "row"]}
            justifyContent="center"
            maxW="full"
            gap={24}
          >
            <Stack maxW="420px" spacing={4} py={[5, 10]}>
              <PortableText
                components={blockContentComponents}
                value={data.secFourColOneParagraph}
              />
            </Stack>
            <Stack maxW="560px" p={[6, 10]} bgColor="#E4D5D5">
              <Heading fontFamily={"Futura"}>{data.secFourColTwoHeading}</Heading>
                <PortableText
                  value={data.secFourColTwoParagraph}
                />
            </Stack>
          </Flex>
        </Stack>
      </Container>
      <Container maxW="container.md" pt={40} pb={20}>
        <Stack spacing={6} align="center" textAlign={"center"}>
          <Heading>{data.secFiveHeading}</Heading>
          <PortableText 
            value={data.secFiveParagraph}
          />
        </Stack>
      </Container>
    </>
  );
};

export async function getStaticProps() {
  const aboutPageQuery = groq`*[_type == "about"][0]`;

  const aboutPageData = await getClient(false).fetch(aboutPageQuery, {});

  return {
    props: {
      data: aboutPageData,
    },
  };
}

export default About;
