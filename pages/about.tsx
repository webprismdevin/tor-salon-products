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
  Code,
  Link,
} from "@chakra-ui/react";
import { groq } from "next-sanity";
import { getClient } from "../lib/sanity";
import Script from "next/script";

const About = ({ data }: any) => {
  return (
    <>
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
            No Half Measures
          </Heading>
          <Text maxW="480px">
            TOR is taking a different approach to hair + body products - we
            don&apos;t compromise, and we don&apos;t ask our customers to.
            That&apos;s why we started with 3 hair care lines based on the
            specific challenges of each hair type.
          </Text>
          <Text maxW="480px">
            TOR is driven by science, not marketing - we formulate our products
            not to work for the most people, but to work for people the most.
            Started in 2014 by beauty industry veteran Shannon Tor, a former
            Avon &amp; Alberto-Culver product chemist with 9 industry awards,
            TOR&apos;s philosophy is simple: “no half-measures”.
          </Text>
        </Stack>
        <Image
          pos={["static", "absolute"]}
          right={0}
          top={40}
          pt={[20, 0]}
          src="/images/about/Tor-family.png"
          alt="Tor family"
        />
        <Stack spacing={6} pl={[8, 20]} pr={[8, 0]} py={[0, 40]}>
          <Heading>Hair Care</Heading>
          <Text maxW="480px">
            Our hair care product lines are driven by the ability to style,
            manage, and maintain a natural feel for your hair, by looking at how
            to actually create moisture, not mimic it. Achieving these results
            is massively different by hair type - where some hair types need
            lots of help retaining moisture, others don&apos;t.
          </Text>
          <Text maxW="480px">
            Taking a “single-sweep” approach ends up with no one getting the
            right result - so Shannon took his 20 years of industry experience
            creating &amp; testing products in real salons, and found the best
            way to create results was individually.
          </Text>
        </Stack>
      </Box>
      <Box pos="relative" h={["auto", 1500]} py={[40, 0]}>
        <Image
          pos={["static", "absolute"]}
          left={0}
          top={[0, 40]}
          src="/images/about/about-cbd.png"
          alt="Tor family"
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
          <Heading>Why CBD?</Heading>
          <Text maxW="480px">
            Shannon has a long history with CBD, going back to his grandparents,
            but TOR Salon Products CBD emerged when co-founder & CFO Tina, who
            is also Shannon&apos;s wife, was diagnosed with Crohn&apos;s
            disease.
          </Text>
          <Text maxW="480px">
            After years of medical intervention, medication, and problems with
            inflammation, Shannon decided to harken back to his
            grandmother&apos;s advice and created a highly concentrated CBD
            “tincture”, knowing cannabinoids ability to tame inflammation.
            Shannon just wanted to give his wife some relief. Within a week,
            Tina was able to eat normal meals - something she hadn&apos;t been
            able to do in years.
          </Text>
          <Text maxW="480px">
            Like TOR&apos;s hair lines, TOR CBD is backed by extensive research
            and science - which is why our CBD products are on average 3-times
            the concentration of the rest of the CBD market. No half-measures.
          </Text>
          <Button>Shop CBD</Button>
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
            <Stack maxW="420px" py={[5, 10]}>
              <Text>
                TOR was born out of the idea that people are unique, and we seek
                to solve those unique challenges. We serve anyone who wants
                natural products, backed by science, that create real results
                (so everyone right?)
              </Text>
              <Text fontWeight={600}>Wrong.</Text>
              <Text>
                We don&apos;t touch anything that we know has a negative impact.
                We&apos;ve been asked many times to create high-margin products
                (both contract &amp; as product lines) that we know are
                chemically dangerous, environmentally unsound (silicone-based
                conditioners), or counter-productive. We don&apos;t touch
                anything that conflicts with our 3 core values.
              </Text>
            </Stack>
            <Stack maxW="560px" p={10} bgColor="#E4D5D5">
              <Heading fontFamily={"Futura"}>TOR Values</Heading>
              <Box>
                <Text fontWeight={600}>Safety first</Text>
                <Text>
                  Shannon doesn&apos;t manufacture anything he wouldn&apos;t put
                  on his children.
                </Text>
              </Box>
              <Box>
                <Text fontWeight={600}>No compromises</Text>
                <Text>
                  We don&apos;t compromise results for cost, or marketing.{" "}
                </Text>
                <Text>
                  Example: we refuse to use silicone-based conditioning agents,
                  such as dimethicone. Instead, we use a naturally-derived
                  conditioning agent that cost over 20x what silicone
                  conditioners cost. And we&apos;re still price competitive.
                </Text>
              </Box>
              <Box>
                <Text fontWeight={600}>Pro-innovation</Text>
                <Text>
                  We use technology in our manufacturing where it&apos;s needed,
                  not for it&apos;s own sake. If we can accomplish the same
                  result with avocado oil, we&apos;re using it.
                </Text>
              </Box>
            </Stack>
          </Flex>
        </Stack>
      </Container>
      <Container maxW="container.md" pt={40} pb={20}>
        <Stack spacing={6} align="center" textAlign={"center"}>
          <Heading>The Future of TOR</Heading>
          <Text>
            We are constantly evolving - introducing new lines, expanding TOR as
            a personal care brand. Our goal is to make personal care more
            customized, more accessible, and more effective.
          </Text>
          <Text>
            As a thank you for spending your time to learn about TOR Salon
            Products, we would like to say thank you. As a token of gratitude,
            for making it to the end, use <Code px={2}>no-half-measures</Code>{" "}
            for 10% off your next purchase.
          </Text>
        </Stack>
      </Container>
      <Container maxW="container.lg" py={20}>
        <Heading textAlign={"center"}>Follow us on Instagram!</Heading>
        <Box textAlign={"center"} my={6}>
          <Link
            href="https://www.instagram.com/tor_salonproducts/"
            target="_blank"
          >
            <Button>Follow</Button>
          </Link>
        </Box>
        <div
          className="embedsocial-hashtag"
          data-ref="e809ba879b57c02fc17f2171500c0a089e3ea49f"
        ></div>
        <Script
          id="embedsocial-script"
          dangerouslySetInnerHTML={{
            __html: `(function(d, s, id){var js; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "https://embedsocial.com/cdn/ht.js"; d.getElementsByTagName("head")[0].appendChild(js);}(document, "script", "EmbedSocialHashtagScript"));`,
          }}
        />
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
