import {
  Flex,
  Stack,
  Container,
  Heading,
  Box,
  Text,
  Button,
  HStack,
  SimpleGrid,
  Icon,
  BoxProps,
  AspectRatio,
  Image,
  ImageProps,
  Divider,
  GridItemProps,
  GridItem,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import NextImage from "next/image";
import Head from "next/head";
import NextLink from "next/link";
// import { groq } from "next-sanity";
// import { getClient, imageBuilder } from "../lib/sanity";
import { gql, GraphQLClient } from "graphql-request";
import ShopContext from "../lib/shop-context";
import { motion } from "framer-motion";
import { FiBookOpen, FiBox, FiCreditCard, FiGift } from "react-icons/fi";

const MotionBox = motion<BoxProps>(Box);
const MotionImage = motion<ImageProps>(Image);
const MotionGridItem = motion<GridItemProps>(GridItem);

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
          <Heading fontSize={[48, 144]}>Uncompromised</Heading>
          <Heading fontSize={[28, 56]}>Hair + Body Products</Heading>
          <HStack justify={"center"}>
            <Button>Shop Hair</Button>
            <Button>Shop Body</Button>
          </HStack>
        </Stack>
      </Container>
      <Box pos="relative" w="full" height={["auto", 520]}>
        <Box pos={["static", "absolute"]} left={0} top={["0", "-90px"]}>
          <NextImage
            src={"/images/home/img1.png"}
            height={639}
            width={555}
            alt="girl with curly hair"
          />
        </Box>
        <Box
          pos="absolute"
          right="0"
          top={[600, 0]}
          display={["none", "inherit"]}
        >
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
        flexDir={["column", "row"]}
        maxW={"full"}
        overflow={"hidden"}
      >
        <HairType
          photo={"/images/hairtypes/fine-hair-girl.jpg"}
          typeImage={"/images/hairtypes/tor-fine_thin_hair.png"}
          title="Fine/Thin"
          link="/type/fine-thin"
        />
        <HairType
          photo={"/images/hairtypes/thick-hair-girl.jpg"}
          typeImage={"/images/hairtypes/tor-thick_medium_hair.png"}
          title="Medium/Thick"
          link="/type/medium-thick"
        />
        <HairType
          photo={"/images/hairtypes/curly-hair-girl.jpg"}
          typeImage={"/images/hairtypes/tor-curly_hair.png"}
          title="Curly"
          link="/type/curly"
        />
      </Flex>
      <Box bgColor="#000000" py={10} px={6}>
        <Container maxW="container.xl">
          <Stack
            direction={["column", "row"]}
            w="full"
            align="center"
            spacing={16}
          >
            <Heading fontSize="64px" color="white">
              Not sure where to start?
            </Heading>
            <Box
              minH={"5px"}
              maxH="5px"
              minW={["20", "200"]}
              flexGrow={1}
              bgColor="white"
            />
            <Button variant={"outline"} color="white">
              Find Your Routine
            </Button>
          </Stack>
        </Container>
      </Box>
      <Container maxW="container.xl" py={20}>
        <Stack direction={["column", "row"]} w="full">
          <Stack maxW="360px" alignSelf={"center"}>
            <Text fontSize={22} textTransform="uppercase">
              Salon Grade -
            </Text>
            <Heading size="2xl">Styling </Heading>
            <Text>
              TOR&apos;s innovative formula let&apos;s you create amazing looks,
              while remaining soft to the touch.
            </Text>
          </Stack>
          <ProductFeature
            name={"Gel 2.0"}
            price={"$39.99"}
            image={"/images/hairtypes/tor-curly_hair.png"}
          />
          <ProductFeature
            name={"Gel 2.0"}
            price={"$39.99"}
            image={"/images/hairtypes/tor-curly_hair.png"}
          />
          <ProductFeature
            name={"Gel 2.0"}
            price={"$39.99"}
            image={"/images/hairtypes/tor-curly_hair.png"}
          />
          <Box
            flexGrow={1}
            textAlign="center"
            minH="100%"
            display={"grid"}
            placeItems={"center"}
          >
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
              - Results Driven
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
      <Box
        py={60}
        bgImage="/images/home/tor-cbd-photoshoot.jpg"
        bgSize={"cover"}
        backgroundPosition={["right", "right"]}
        // bgAttachment={["scroll", "fixed"]}
        borderTop="10px solid #000000"
        pos="relative"
      >
        {/* <Container maxW="container.xl"> */}
        <Stack
          maxW="520px"
          p={8}
          borderRadius={10}
          pos="absolute"
          left={0}
          top={0}
        >
          <Text fontSize={22} textTransform="uppercase">
            
          </Text>
          <Heading size="2xl">CBD Products</Heading>
          <Text>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium
            soluta voluptatibus consectetur sit natus.
          </Text>
          <Button alignSelf="flex-start">Shop CBD</Button>
        </Stack>
        {/* </Container> */}
      </Box>
      <Box pt={40}>
        <Container centerContent mb={20}>
          <Heading size="2xl" mb={8}>
            Best Selling
          </Heading>
          <Divider />
        </Container>
        <SimpleGrid templateColumns={"repeat(3, 1fr)"} mb={40} w="full">
          {/* will change to .map */}
          <GridFeature
            name={"Gel 2.0"}
            price={"$39.99"}
            image={"/test/styled/gel_2.png"}
          />
          <GridFeature
            name={"Medium/Thick \n Conditioner"}
            price={"$39.99"}
            image={"/test/styled/mc.png"}
          />
          <GridFeature
            name={"Medium/Thick Shampoo"}
            price={"$39.99"}
            image={"/test/styled/ms.png"}
          />
          <GridFeature
            name={"Medium/Thick Travel Shampoo"}
            price={"$39.99"}
            image={"/test/styled/mts.png"}
          />
          <GridFeature
            name={"Medium/Thick Travel Conditioner"}
            price={"$39.99"}
            image={"/test/styled/mtc.png"}
          />
          <GridFeature
            name={"Conditioner Bundle"}
            price={"$39.99"}
            image={"/images/hairtypes/tor-curly_hair.png"}
          />
        </SimpleGrid>
      </Box>
      <Box>
        <Flex gap={20} flexDir={["column-reverse", "row"]}>
          <Box
            py={[20, 40]}
            px={[20, 40]}
            borderRightRadius={4}
            color="white"
            bgColor={"black"}
          >
            <Text
              textTransform={"uppercase"}
              mb={[0, -10]}
              textAlign={["center", "left"]}
            >
              About
            </Text>
            <Heading fontSize={[114, 220]}>TOR</Heading>
          </Box>
          <Box maxW={["auto", "300"]} p={[8, 10]}>
            <Text fontSize={22} textTransform="uppercase">
              Testimonials
            </Text>
            <Text fontStyle={"italic"}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis
              rerum dolorem dolorum a eius, nostrum facere amet facilis esse
              iste illum, vitae ut! Incidunt labore officia voluptate
              blanditiis, aliquam architecto!
            </Text>
            <HStack gap={4}>
              <a>←</a>
              <a>→</a>
            </HStack>
          </Box>
        </Flex>
        <Box py={40} height={["auto", 800]} pos="relative">
          <Container maxW="container.xl">
            <Stack maxW="560px">
              <Text fontSize={22} textTransform="uppercase">
                Pro Innovation -
              </Text>
              <Heading size="2xl">
                Naturally derived, formulated for results.
              </Heading>
              <Text>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut,
                debitis? Fugit dolorum rem impedit a ipsa odio quas nihil!
                Voluptatibus, ducimus sit? Asperiores repellendus quos nihil ex
                soluta assumenda enim?
              </Text>
              <Button alignSelf={"flex-start"}>About Us</Button>
            </Stack>
          </Container>
          <Image
            pos={["static", "absolute"]}
            top={[0, -280]}
            right={0}
            src="/images/home/tina-shannon-about.png"
            alt="tina and shannon tor"
          />
        </Box>
      </Box>
      <Box pos="relative" pt={10} w="full" height={["auto", 1000]}>
        <Image
          height={["auto", 912]}
          pos={["static", "absolute"]}
          src="/images/home/salon-stylist.png"
          alt="a stylist curling a customers blonde hair"
        />
        {/* <Container maxW="container.xl"> */}
        <Stack
          maxW="560px"
          py={[8, 80]}
          spacing={4}
          pos={["static", "absolute"]}
          right={[0, 20]}
          px={[4, 0]}
        >
          <Text fontSize={22} textTransform="uppercase">
            TOR Professionals
          </Text>
          <Heading size="2xl">Salons + Stylists</Heading>
          <Text>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum ea
            harum soluta impedit veritatis enim libero, ipsa, dolorem, eum
            temporibus tempora. Accusamus maxime minus consectetur molestiae
            iste tenetur dolor quasi!
          </Text>
          <Button alignSelf={"flex-start"}>Learn More</Button>
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
                <Icon as={FiBox} boxSize={8} />
                <Text>Priority Shipping</Text>
              </Box>
              <Box textAlign={"center"}>
                <Icon as={FiGift} boxSize={8} />
                <Text>Special Offers</Text>
              </Box>
            </HStack>
          </Box>
        </Stack>
      </Box>
      <Container maxW="container.xl" pb={40} mt={20}>
        <Box
          dangerouslySetInnerHTML={{
            __html: `<div class="embedsocial-hashtag" data-ref="3da7961275f3a181f97c540d896b4353084e707f"></div><script>(function(d, s, id){var js; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "https://embedsocial.com/cdn/ht.js"; d.getElementsByTagName("head")[0].appendChild(js);}(document, "script", "EmbedSocialHashtagScript"));</script>`,
          }}
        />
      </Container>
    </>
  );
}

declare interface ProductFeatureTypes {
  name: string;
  price: string;
  image: string;
}

const ProductFeature = ({ name, price, image }: ProductFeatureTypes) => {
  return (
    <MotionBox
      flexGrow={1}
      textAlign="center"
      display={"grid"}
      placeItems={"center"}
      initial="initial"
      whileHover="hover"
      pos="relative"
      minH={[360, "auto"]}
    >
      <MotionImage
        src={image}
        alt=""
        pos="absolute"
        zIndex={-1}
        variants={{
          initial: { opacity: 0.25 },
          hover: { opacity: 1 },
        }}
      />
      <MotionBox variants={{ initial: { opacity: 1 }, hover: { opacity: 0 } }}>
        <Heading>{name}</Heading>
        <Text>{price}</Text>
      </MotionBox>
    </MotionBox>
  );
};

const GridFeature = ({
  name,
  price,
  image,
  link,
}: {
  name: string;
  price: string;
  image: string;
  link?: string;
}) => {
  return (
    <GridItem colSpan={[3, 1]} overflow="hidden">
      <NextLink href={link ? link : ""} passHref>
        <MotionBox
          py={48}
          pos="relative"
          width={"100%"}
          // display={"grid"}
          // placeItems={"center"}
          initial="initial"
          whileHover="hover"
        >
          <AspectRatio
            minW={"100%"}
            minH={"100%"}
            ratio={1 / 1}
            pos="absolute"
            top={0}
            left={0}
            zIndex={-1}
          >
            <MotionImage
              src={image}
              // objectFit={"cover"}
              minW={"100%"}
              minH={"100%"}
              alt=""
              variants={{
                initial: {
                  opacity: 0.25,
                },
                hover: {
                  opacity: 1,
                },
              }}
            />
          </AspectRatio>
          <MotionBox
            textAlign={"center"}
            variants={{ initial: { opacity: 1 }, hover: { opacity: 0 } }}
          >
            <Heading>{name}</Heading>
            <Text>{price}</Text>
          </MotionBox>
        </MotionBox>
      </NextLink>
    </GridItem>
  );
};

const HairType = ({
  typeImage,
  title,
  photo,
  link,
}: {
  typeImage: string;
  title: string;
  photo: string;
  link: string;
}) => {
  return (
    <NextLink href={link} passHref>
      <MotionBox
        py={48}
        pos="relative"
        width={["full", "33.33%"]}
        display={"grid"}
        placeItems={"center"}
        initial="initial"
        whileHover="hover"
      >
        <MotionImage
          src={photo}
          objectFit={"fill"}
          pos="absolute"
          zIndex={0}
          alt=""
          variants={{
            initial: {
              opacity: 0,
            },
            hover: {
              opacity: 1,
            },
          }}
        />
        <MotionImage
          src={typeImage}
          objectFit={"fill"}
          pos="absolute"
          zIndex={-1}
          transform={"rotate(35deg)"}
          alt=""
          variants={{
            initial: {
              opacity: 0.25,
            },
            hover: {
              opacity: 0,
            },
          }}
        />
        <Heading>{title}</Heading>
      </MotionBox>
    </NextLink>
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
