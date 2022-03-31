import {
  Flex,
  Stack,
  Container,
  Heading,
  VStack,
  Box,
  Text,
  Button,
  List,
  ListItem,
  ListIcon,
  HStack,
  SimpleGrid,
  GridItem,
  Icon,
  BoxProps,
  GridItemProps,
  AspectRatio,
  Image,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import NextImage from "next/image";
import Head from "next/head";
import Link from "next/link";
import { groq } from "next-sanity";
import { getClient, imageBuilder } from "../lib/sanity";
import { gql, GraphQLClient } from "graphql-request";
import ShopContext from "../lib/shop-context";
import HairTypeLarge from "https://framer.com/m/Hair-Type-Large-IcBP.js@G5D5WiJN93Rct95465Hf";
import GridFeaturedItem from "https://framer.com/m/FeaturedProductCard-Q7PS.js@taba3IHB3qonGWRNolXu"
import dynamic from "next/dynamic";

function HomePage({ homepageData, collection }: any) {
  const { shop } = useContext(ShopContext);

  return (
    <>
      <Head>
        <title>{shop.name}</title>
        <meta name="description" content="" />
      </Head>
      <Container py={20} centerContent pos="relative" maxW="container.xl">
        <Stack spacing={4} textAlign={"center"}>
          <Heading fontSize={144}>Uncompromised</Heading>
          <Heading fontSize={56}>Hair + Body Products</Heading>
          <HStack justify={"center"}>
            <Button>Shop Hair</Button>
            <Button>Shop Body</Button>
          </HStack>
        </Stack>
      </Container>
      <Box pos="relative" w="full" height={520}>
        <Box pos="absolute" left={0} top={"-90px"}>
          <NextImage
            src={"/images/home/img1.png"}
            height={639}
            width={555}
            alt="girl with curly hair"
          />
        </Box>
        <Box pos="absolute" right="0" top={0}>
          <NextImage
            src={"/images/home/img2.png"}
            height={800}
            width={555}
            alt="girl with wavy hair"
          />
        </Box>
      </Box>
      <Container maxW="container.xl" pt={20} pb={40}>
        <Stack maxW="560px">
          <Text fontSize={22} textTransform="uppercase">
            Salon Grade -
          </Text>
          <Heading size="2xl">
            Hair care formulated for you. Not Everyone
          </Heading>
          <Text>
            TOR products are formulated specifically by hair type, to tackle
            their unique challenges - not for mass appeal.
          </Text>
        </Stack>
      </Container>
      <Flex
        borderColor="#222222"
        borderTop="10px solid"
        justify={"center"}
        align="stretch"
      >
        <HairTypeLarge
          image={"/images/hairtypes/fine-hair-girl.jpg"}
          title="Fine/Thin"
          typeImage={"/images/hairtypes/tor-fine_thin_hair.png"}
        />
        <HairTypeLarge
          image={"/images/hairtypes/thick-hair-girl.jpg"}
          title="Medium/Thick"
          typeImage={"/images/hairtypes/tor-thick_medium_hair.png"}
        />
        <HairTypeLarge
          image={"/images/hairtypes/curly-hair-girl.jpg"}
          title="Curly"
          typeImage={"/images/hairtypes/tor-curly_hair.png"}
        />
      </Flex>
      <Box bgColor="#000000" py={10} px={6}>
        <Container maxW="container.xl">
          <HStack w="full" align="center" spacing={16}>
            <Heading fontSize="64px" color="white">
              Not sure where to start?
            </Heading>
            <Box
              minH={"5px"}
              maxH="5px"
              minW="200"
              flexGrow={1}
              bgColor="white"
            />
            <Button variant={"outline"} color="white">
              Find Your Routine
            </Button>
          </HStack>
        </Container>
      </Box>
      <Container maxW="container.xl" py={20}>
        <Stack direction="row" w="full">
          <Stack maxW="360px">
            <Text fontSize={22} textTransform="uppercase">
              Salon Grade -
            </Text>
            <Heading size="2xl">Styling </Heading>
            <Text>
              TOR&apos;s innovative formula let&apos;s you create amazing looks,
              while remaining soft to the touch.
            </Text>
          </Stack>
          <ProductFeature name={"Gel 2.0"} price={"$39.99"} />
          <ProductFeature name={"Gel 2.0"} price={"$39.99"} />
          <ProductFeature name={"Gel 2.0"} price={"$39.99"} />
          <Box flexGrow={1} textAlign="center">
            <Text>See all →</Text>
          </Box>
        </Stack>
      </Container>
      <Box
        h={700}
        bgImage={"/images/home/skin-bg.jpg"}
        bgSize="cover"
        bgPos="bottom"
        pos="relative"
      >
        <Box pos="absolute" bottom={0} right={0} p={8}>
          <Stack maxW="320px" align={"flex-end"} textAlign={"right"}>
            <Text fontSize={22} textTransform="uppercase">
              Results Driven -
            </Text>
            <Heading size="2xl">Skin + Body</Heading>
            <Text>
              Skin + Body products formulated for results with clean
              ingredients. Backed by science.
            </Text>
            <Button>Shop Skin + Body</Button>
          </Stack>
        </Box>
      </Box>
      <Container py={40}>CBD Section!</Container>
      <SimpleGrid templateColumns={"repeat(3, 1fr)"} mb={20}>
        {/* will change to .map */}
        <AspectRatio ratio={1 / 1}>
          <GridFeature name={"Conditioner Bundle"} price={"$39.99"} />
        </AspectRatio>
        <AspectRatio ratio={1 / 1}>
          <GridFeature name={"Conditioner Bundle"} price={"$39.99"} />
        </AspectRatio>
        <AspectRatio ratio={1 / 1}>
          <GridFeature name={"Conditioner Bundle"} price={"$39.99"} />
        </AspectRatio>
        <AspectRatio ratio={1 / 1}>
          <GridFeature name={"Conditioner Bundle"} price={"$39.99"} />
        </AspectRatio>
        <AspectRatio ratio={1 / 1}>
          <GridFeature name={"Conditioner Bundle"} price={"$39.99"} />
        </AspectRatio>
        <AspectRatio ratio={1 / 1}>
          <GridFeature name={"Conditioner Bundle"} price={"$39.99"} />
        </AspectRatio>
      </SimpleGrid>
    </>
  );
}

declare interface ProductFeatureTypes {
  name: string;
  price: string;
}

const ProductFeature = ({ name, price }: ProductFeatureTypes) => {
  return (
    <Box flexGrow={1} textAlign="center" bgImage={""}>
      <Heading>{name}</Heading>
      <Text>{price}</Text>
    </Box>
  );
};

const GridFeature = ({ name, price }: ProductFeatureTypes) => {
  return (
    <GridItem>
      <GridFeaturedItem />
    </GridItem>
  );
};

export default HomePage;

export async function getStaticProps() {
  // const homepageQuery = groq`*[_type == "homepage"]{
  //   heroTitle, heroSubtitle, heroImage, about, aboutImage
  // }[0]`;

  // const homepageData = await getClient(false).fetch(homepageQuery, {});

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
      collectionByHandle(handle: "home") {
        id
        title
        products(first: 4) {
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
              images(first: 2) {
                edges {
                  node {
                    altText
                    transformedSrc
                  }
                }
              }
              priceRange {
                maxVariantPrice {
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

  return {
    props: {
      homepageData: null,
      collection: res.collectionByHandle,
    },
    revalidate: 3600,
  };
}
