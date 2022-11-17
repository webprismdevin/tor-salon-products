import {
  Stack,
  HStack,
  Container,
  Heading,
  Image,
  Button,
  Link,
  Flex,
  Box,
  Text,
  SimpleGrid,
  Icon,
  BoxProps,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import NextImage from "next/legacy/image";
import Head from "next/head";
import NextLink from "next/link";
import { gql, GraphQLClient } from "graphql-request";
import { motion } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiCreditCard, FiGift } from "react-icons/fi";
import dynamic from "next/dynamic";
import { sanity } from "../lib/sanity";
import groq from "@sanity/client";
import curlyHairGirl from "../public/images/home/img1.png";

const Testimonials = dynamic(() => import("../components/Home/Testimonials"));
const ProductFeature = dynamic(() => import("../components/Home/HomeFeature"));
const GridFeature = dynamic(() => import("../components/Home/GridFeature"));
const HairType = dynamic(() => import("../components/Home/HairType"));

const MotionBox = motion<BoxProps>(Box);

function HomePage({ products, styling, body, homepageData }: any) {
  const hairTypeSelect = useRef<HTMLDivElement | null>(null);

  return <>
    <Head>
      <title>{homepageData.seo_title}</title>
      <meta name="description" content={homepageData.seo_description} />
    </Head>
    <Container py={20} centerContent pos="relative" maxW="container.xl">
      <Stack spacing={4} textAlign={"center"}>
        <Heading fontSize={[42, 84, null, null, 144]} as="h1">
          {homepageData.heroTitle}
        </Heading>
        <Heading fontSize={[28, 48, null, null, 56]}>
          {homepageData.heroSubtitle}
        </Heading>
        <HStack justify={"center"} spacing={4}>
          <Button
            onClick={() =>
              hairTypeSelect.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
          >
            Shop Hair
          </Button>
          <Link href="https://tor-cbd.square.site/s/shop" target="_blank">
            <Button>Shop CBD</Button>
          </Link>
        </HStack>
      </Stack>
    </Container>
    <Box pos="relative" height={["auto", 520]}>
      <Box
        left={0}
        pos={["static", null, null, null, "absolute"]}
        top={["0", "-90px"]}
        mr={[4, 0]}
      >
        <NextImage
          src={curlyHairGirl}
          // height={639}
          // width={555}
          alt="girl with curly hair"
          priority
          quality={85}
        />
      </Box>
      <Box
        pos="absolute"
        right={0}
        top={[600, 0]}
        display={["none", null, null, null, "inherit"]}
      >
        <NextImage
          src={"/images/home/img2.png"}
          height={800}
          width={555}
          alt="girl with wavy hair"
          quality={85}
        />
      </Box>
    </Box>
    <Container maxW="container.xl" pt={[20, 200, null, null, 20]} pb={40}>
      <Stack maxW="600px" px={[2, 0]}>
        <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
          Salon Quality -
        </Text>
        <Heading size="2xl">
          Hair care formulated for you. Not Everyone.
        </Heading>
        <Text>
          TOR products are formulated specifically by hair type, to tackle
          their unique needs - not for mass appeal. Made in the USA.
        </Text>
      </Stack>
    </Container>
    <Box ref={hairTypeSelect} pt={[4, 0]}>
      <Container maxW="container.xl" py={8}>
        <Heading>What&apos;s Your Hair Type?</Heading>
      </Container>
      <Flex
        borderColor="#222222"
        borderTop="10px solid"
        justify={"center"}
        align="stretch"
        flexDir={["row"]}
        maxW={"full"}
        overflow={"hidden"}
      >
        <HairType
          photo={"/images/hairtypes/fine-hair-girl.jpg"}
          typeImage={"/images/hairtypes/tor-fine_thin_hair.png"}
          title="Fine / Thin"
          link="/type/fine-thin"
        />
        <HairType
          photo={"/images/hairtypes/thick-hair-girl.jpg"}
          typeImage={"/images/hairtypes/tor-thick_medium_hair.png"}
          title="Medium / Thick"
          link="/type/medium-thick"
        />
        <HairType
          photo={"/images/hairtypes/curly-hair-girl.jpg"}
          typeImage={"/images/hairtypes/tor-curly_hair.png"}
          title="Curly"
          link="/type/curly"
        />
      </Flex>
    </Box>
    <Box bgColor="#000000" py={10} px={[2, 6]}>
      <Container maxW="container.xl">
        <Stack direction={["row"]} w="full" align="center" spacing={[4, 16]}>
          <Heading
            fontSize={[18, 28]}
            color="white"
            textAlign={["left", "left"]}
          >
            Not sure where to start?
          </Heading>
          <Box
            h={["2px", "5px"]}
            minW={["50", "200"]}
            flexGrow={1}
            bgColor="white"
            display={["none", "inherit"]}
          />
          <Button
            onClick={() => window.Tawk_API.maximize()}
            variant={"outline"}
            color="white"
            flexShrink={0}
          >
            We can help
          </Button>
        </Stack>
      </Container>
    </Box>
    <Container maxW="container.xl" py={36}>
      <Stack
        direction={["column", "row"]}
        w="full"
        justifyContent={"space-between"}
      >
        <Stack
          px={[2, 0]}
          maxW={["none", "240px"]}
          alignSelf={"center"}
          justify={"space-between"}
        >
          <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
            Longer Lasting -
          </Text>
          <Heading size="2xl">Styling</Heading>
          <Text>
            TOR&apos;s innovative formulas let&apos;s you create amazing
            looks, while remaining soft to the touch.
          </Text>
        </Stack>
        {styling.map((prod: any) => (
          <ProductFeature
            key={prod.node.id}
            name={prod.node.title}
            price={prod.node.priceRange.minVariantPrice.amount}
            image={prod.node.images.edges[0].node.url}
            link={`/product/${prod.node.handle}`}
          />
        ))}
        <Box
          flexShrink={0}
          minH={[20, "100%"]}
          display={"grid"}
          placeItems={["center", "center end"]}
        >
          <NextLink href="/collection/styling" passHref legacyBehavior>
            <Link>See all →</Link>
          </NextLink>
        </Box>
      </Stack>
    </Container>
    <Box pos="relative" overflow={"hidden"}>
      <Box pos="absolute" top={0} left={0} w={"100%"} zIndex={0}>
        <NextImage
          src="/images/home/skin-bg.jpeg"
          alt="girl putting looking in a mirror"
          layout="responsive"
          width={1800}
          height={1200}
        />
      </Box>
      <Container py={200} maxW="container.lg" pos="relative" zIndex="1">
        <Stack align={"center"} textAlign={"center"}>
          <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
            - Results Driven -
          </Text>
          <Heading size="2xl">Body + Skin</Heading>
          <Text maxW="400px" fontSize={"xl"}>
            Body + Skin products formulated for results with clean
            ingredients. Backed by science.
          </Text>
          <NextLink href="/all-body-products" passHref legacyBehavior>
            <Button>Shop Body</Button>
          </NextLink>
        </Stack>
      </Container>
    </Box>
    <Container maxW="container.lg" py={48}>
      <Stack
        direction={["column", "row"]}
        w="full"
        justify="center"
        gap={20}
        maxH={["none", 120]}
      >
        {body.map((prod: any) => (
          <ProductFeature
            key={prod.node.id}
            name={prod.node.title}
            price={prod.node.priceRange.minVariantPrice.amount}
            image={prod.node.images.edges[0].node.url}
            link={`/product/${prod.node.handle}`}
          />
        ))}
      </Stack>
    </Container>
    <Box
      height={["auto", 760]}
      borderTop="10px solid #000000"
      pos="relative"
      px={[2, 0]}
      py={[2, 0]}
      overflow="hidden"
    >
      <Box pos={"absolute"} top={0} left={0} width={"100%"} zIndex={0}>
        <NextImage
          src="/images/tor-cbd-2.jpg"
          alt="cbd-tincture"
          layout="responsive"
          width={1800}
          height={1200}
        />
      </Box>
      <Stack
        maxW="520px"
        px={[4, 8]}
        py={[12, 8]}
        borderRadius={10}
        pos={["static", "static", "static", "static", "absolute"]}
        left={0}
        top={0}
      >
        <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
          Truly Effective -
        </Text>
        <Heading size="4xl">CBD</Heading>
        <Text>
          TOR CBD products are made in the USA, from FDA approved producers,
          and contain significantly more CBD that typical products, making TOR
          CBD more effective.
        </Text>
        <Link href="https://tor-cbd.square.site/s/shop" target="_blank">
          <Button alignSelf={"flex-start"}>Shop All CBD</Button>
        </Link>
      </Stack>
      <Stack
        pos={["static", null, null, null, "absolute"]}
        direction={["column", "row"]}
        bottom={8}
        left={8}
        p={[2, 0]}
        spacing={[4]}
      >
        <Link
          href="https://cbd.torsalonproducts.com/shop/cbd-tinctures/3"
          target={"_blank"}
        >
          <MotionBox
            whileHover={{
              scale: 1.02,
            }}
            bg="white"
            p={8}
          >
            <Image
              src={"/images/750mg-tincture.png"}
              w={["auto", 240]}
              alt="a cbd tincture bottle"
              loading="lazy"
            />
            <Flex justify={"space-between"}>
              <Text>CBD Consumables</Text>
              <Icon as={FiArrowRight} size={4} />
            </Flex>
          </MotionBox>
        </Link>
        <Link
          href="https://cbd.torsalonproducts.com/shop/cbd-lotions/2"
          target={"_blank"}
        >
          <MotionBox
            whileHover={{
              scale: 1.02,
            }}
            bg="white"
            p={8}
          >
            <Image
              src={"/images/250ml-roll-on.png"}
              w={["auto", 240]}
              alt="TOR 250ml CBD roll-on"
              loading="lazy"
            />
            <Flex justify={"space-between"}>
              <Text>CBD Lotions</Text>
              <Icon as={FiArrowRight} size={4} />
            </Flex>
          </MotionBox>
        </Link>
      </Stack>
    </Box>
    <Box pt={40}>
      <Container centerContent mb={10}>
        <Stack spacing={6} align="center">
          <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
            - Best Selling -
          </Text>
          <Heading size="2xl">Featured Items</Heading>
        </Stack>
      </Container>
      <SimpleGrid templateColumns={"repeat(3, 1fr)"} mb={40} w="full">
        {products.map((product: any) => (
          <GridFeature
            key={product.node.id}
            name={product.node.title}
            price={product.node.priceRange.minVariantPrice.amount}
            image={product.node.images.edges[0]?.node.url}
            link={`/product/${product.node.handle}`}
          />
        ))}
      </SimpleGrid>
    </Box>
    <Box>
      <Flex gap={20} flexDir={["column-reverse", null, null, null, "row"]}>
        <Box
          py={[20, 40]}
          px={[6, 40]}
          borderRightRadius={4}
          color="white"
          bgColor={"black"}
        >
          <Text
            textTransform={"uppercase"}
            mb={[0, -10]}
            textAlign={["left", "left"]}
          >
            About
          </Text>
          <Heading fontSize={[160, 220]} fontFamily={"Futura"}>
            TOR
          </Heading>
        </Box>
        <Box maxW={["auto", "400"]} p={[8]}>
          <Testimonials />
        </Box>
      </Flex>
      <Box
        py={40}
        height={["auto", "auto", 1350, "auto", 800]}
        pos="relative"
      >
        <Container maxW="container.xl">
          <Stack maxW="560px" spacing={4} px={[4, null, 4, 0]}>
            <Text
              fontSize={22}
              textTransform="uppercase"
              fontFamily={"Futura"}
            >
              Pro Innovation -
            </Text>
            <Heading size="2xl">
              Naturally derived, backed by science.
            </Heading>
            <Text>
              TOR is taking a different approach to hair + body products - we
              don&apos;t compromise, and we don&apos;t ask our customers to.
              That&apos;s why we started with 3 hair care lines based on the
              specific needs of each hair type.
            </Text>
            <NextLink href={"/about"} passHref legacyBehavior>
              <Button alignSelf={"flex-start"}>About Us</Button>
            </NextLink>
          </Stack>
        </Container>
        <Image
          pos={["static", null, "absolute", null, "absolute"]}
          top={[0, null, 320, -280]}
          right={0}
          src="/images/home/tina-shannon-about.png"
          alt="tina and shannon tor"
          pl={[4, 0]}
          loading="lazy"
        />
      </Box>
    </Box>
    <Box
      pos="relative"
      pt={10}
      w="full"
      height={["auto", "auto", "auto", "auto", 1000]}
    >
      <Image
        display={["inherit", null, "none", "inherit"]}
        height={["auto", 912]}
        pos={["static", "static", "static", "static", "absolute"]}
        src="/images/home/salon-stylist.png"
        alt="a stylist curling a customers blonde hair"
        pr={[4, 0]}
        loading="lazy"
      />
      <Stack
        maxW="560px"
        py={[8, 8, 16, null, 80]}
        spacing={4}
        pos={["static", "static", "static", "static", "absolute"]}
        right={[0, 20]}
        px={[8, null, 8, 0]}
      >
        <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
          TOR Professionals -
        </Text>
        <Heading size="2xl">Salons + Stylists</Heading>
        <Text>
          TOR Salon Products was started by a haircare industry veteran, with
          a strong understanding of stylist and salons challenges, and over a
          decade helping salons formulate products for their clients.
        </Text>
        <Text>
          Our Salon + Stylist program supports our salon partners and their
          stylists, with an open door, and a focus on innovative.
        </Text>
        <NextLink href="/professionals" passHref legacyBehavior>
          <Button alignSelf={"flex-start"}>Learn More</Button>
        </NextLink>
        <Box pt={8}>
          <Heading mb={4}>Benefits</Heading>
          <HStack spacing={6}>
            <Box textAlign={"center"}>
              <Icon as={FiBookOpen} boxSize={8} />
              <Text>Education</Text>
            </Box>
            <Box textAlign={"center"}>
              <Icon as={FiCreditCard} boxSize={8} />
              <Text>Wholesale Pricing</Text>
            </Box>
            <Box textAlign={"center"}>
              <Icon as={FiGift} boxSize={8} />
              <Text>Special Offers</Text>
            </Box>
          </HStack>
        </Box>
      </Stack>
    </Box>
  </>;
}

export default HomePage;

export async function getStaticProps() {
  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
      },
    }
  );

  // Shopify Request
  const query = gql`
    {
      featured: collection(handle: "home") {
        id
        title
        products(first: 6) {
          edges {
            node {
              id
              title
              description
              handle
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                maxVariantPrice {
                  amount
                }
                minVariantPrice {
                  amount
                }
              }
              compareAtPriceRange {
                maxVariantPrice {
                  amount
                }
              }
            }
          }
        }
      }
      styling: collection(handle: "styling") {
        id
        title
        products(first: 3) {
          edges {
            node {
              id
              title
              description
              handle
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                maxVariantPrice {
                  amount
                }
                minVariantPrice {
                  amount
                }
              }
              compareAtPriceRange {
                maxVariantPrice {
                  amount
                }
              }
            }
          }
        }
      }
      body: collection(handle: "homepage-body") {
        id
        title
        products(first: 3) {
          edges {
            node {
              id
              title
              description
              handle
              variants(first: 1) {
                edges {
                  node {
                    id
                  }
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              priceRange {
                maxVariantPrice {
                  amount
                }
                minVariantPrice {
                  amount
                }
              }
              compareAtPriceRange {
                maxVariantPrice {
                  amount
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  const homepageQuery = `*[_type == "homepage"][0]`;

  const homepageData = await sanity.fetch(homepageQuery, {});

  return {
    props: {
      homepageData,
      styling: res.styling.products.edges,
      collection: res.featured,
      products: res.featured.products.edges,
      body: res.body.products.edges,
    },
    revalidate: 10,
  };
}
