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
  GridItem,
  TextProps,
  Link
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import NextImage from "next/image";
import Head from "next/head";
import NextLink from "next/link";
import Script from "next/script";
import { wrap } from "@popmotion/popcorn";
// import { groq } from "next-sanity";
// import { getClient, imageBuilder } from "../lib/sanity";
import { gql, GraphQLClient } from "graphql-request";
import ShopContext from "../lib/shop-context";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  FiArrowRight,
  FiBookOpen,
  FiBox,
  FiCreditCard,
  FiGift,
} from "react-icons/fi";
import formatter from "../lib/formatter";

const MotionBox = motion<BoxProps>(Box);
const MotionImage = motion<ImageProps>(Image);
const MotionText = motion<TextProps>(Text);

function HomePage({ products, styling, body }: any) {
  const { shop } = useContext(ShopContext);

  return (
    <>
      <Head>
        <title>Uncompromised Hair + Body Products | TOR Salon Products</title>
        <meta name="description" content="" />
      </Head>
      <Container py={20} centerContent pos="relative" maxW="container.xl">
        <Stack spacing={4} textAlign={"center"}>
          <Heading fontSize={[42, 144]}>Uncompromised</Heading>
          <Heading fontSize={[28, 56]}>Hair + Body Products</Heading>
          <HStack justify={"center"}>
            <NextLink href="/all-hair-care" passHref>
              <Button>Shop Hair</Button>
            </NextLink>
            <NextLink href="/all-body-products" passHref>
              <Button>Shop Body</Button>
            </NextLink>
          </HStack>
        </Stack>
      </Container>
      <Box pos="relative" w="full" height={["auto", 520]}>
        <MotionBox
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: { delay: 0.4 },
          }}
          left={0}
          pos={["static", "absolute"]}
          top={["0", "-90px"]}
        >
          <NextImage
            src={"/images/home/img1.png"}
            height={639}
            width={555}
            alt="girl with curly hair"
          />
        </MotionBox>
        <MotionBox
          pos="absolute"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: { delay: 0.8 },
          }}
          right={0}
          top={[600, 0]}
          display={["none", "inherit"]}
        >
          <NextImage
            src={"/images/home/img2.png"}
            height={800}
            width={555}
            alt="girl with wavy hair"
          />
        </MotionBox>
      </Box>
      <Container maxW="container.xl" pt={20} pb={40}>
        <Stack maxW="560px">
          <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
            Salon Grade -
          </Text>
          <Heading size="2xl">
            Hair care formulated for you. Not Everyone
          </Heading>
          <Text>
            TOR products are formulated specifically by hair type, to tackle
            their unique challenges - not for mass appeal. Made in the USA.
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
      <Box bgColor="#000000" py={10} px={[2, 6]}>
        <Container maxW="container.xl">
          <Stack
            direction={["column", "row"]}
            w="full"
            align="center"
            spacing={[8, 16]}
          >
            <Heading
              fontSize={[48, 64]}
              color="white"
              textAlign={["center", "left"]}
            >
              Not sure where to start?
            </Heading>
            <Box
              minH={"5px"}
              maxH="5px"
              minW={["20", "200"]}
              flexGrow={1}
              bgColor="white"
            />
            <Button
              onClick={() => window.Tawk_API.maximize()}
              variant={"outline"}
              color="white"
            >
              We can help
            </Button>
          </Stack>
        </Container>
      </Box>
      <Container maxW="container.xl" py={20}>
        <Stack direction={["column", "row"]} w="full">
          <Stack
            maxW={["none", "240px"]}
            alignSelf={"center"}
            justify={"space-between"}
          >
            <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
              Salon Grade -
            </Text>
            <Heading size="2xl">Styling</Heading>
            <Text>
              TOR&apos;s innovative formula let&apos;s you create amazing looks,
              while remaining soft to the touch.
            </Text>
          </Stack>
          {styling.map((prod: any) => (
            <ProductFeature
              key={prod.node.id}
              name={prod.node.title}
              price={prod.node.priceRange.minVariantPrice.amount}
              image={prod.node.images.edges[0].node.url}
            />
          ))}
          <Box
            flexShrink={0}
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
        bgImage={"/images/home/skin-bg.jpg"}
        bgSize="cover"
        bgPos={["center", "bottom left"]}
      >
        <Container py={200} maxW="container.lg">
          <Stack align={"center"} textAlign={"center"}>
            <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
              - Results Driven -
            </Text>
            <Heading size="2xl">Body + Skin</Heading>
            <Text maxW="400px" fontSize={"xl"}>
              Body + Skin products formulated for results with clean
              ingredients. Backed by science.
            </Text>
            <Button>Shop Body + Skin</Button>
          </Stack>
        </Container>
      </Box>
      <Container maxW="container.md" py={20} my={10}>
        <Stack
          direction={["column", "row"]}
          w="full"
          justify="space-between"
          maxH={["none", 120]}
        >
          {body.map((prod: any) => (
            <ProductFeature
              key={prod.node.id}
              name={prod.node.title}
              price={prod.node.priceRange.minVariantPrice.amount}
              image={prod.node.images.edges[0].node.url}
            />
          ))}
        </Stack>
      </Container>
      <Box
        height={["auto", 700]}
        bgImage="/images/tor-cbd-2.jpg"
        borderTop="10px solid #000000"
        bgSize={"cover"}
        backgroundPosition={["bottom right", "right"]}
        pos="relative"
        px={[2, 0]}
      >
        <Stack
          maxW="520px"
          px={[4, 8]}
          py={[12, 8]}
          borderRadius={10}
          pos={["static", "absolute"]}
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
        </Stack>
        <Stack
          pos={["static", "absolute"]}
          direction={["column", "row"]}
          bottom={8}
          left={8}
          w="full"
          p={[2, 0]}
          spacing={[4]}
        >
          <NextLink href="/collection/cdb-tinctures" passHref>
            <MotionBox
              whileHover={{
                scale: 1.02,
              }}
              bg="white"
              p={8}
            >
              <Image src={"/images/750mg-tincture.png"} w={240} alt="" />
              <Flex justify={"space-between"}>
                <Text>CBD Tinctures</Text>
                <Icon as={FiArrowRight} size={4} />
              </Flex>
            </MotionBox>
          </NextLink>
          <NextLink href="/collection/cdb-lotions" passHref>
            <MotionBox
              whileHover={{
                scale: 1.02,
              }}
              bg="white"
              p={8}
            >
              <Image src={"/images/250ml-roll-on.png"} w={240} alt="" />
              <Flex justify={"space-between"}>
                <Text>CBD Lotions</Text>
                <Icon as={FiArrowRight} size={4} />
              </Flex>
            </MotionBox>
          </NextLink>
        </Stack>
        <Box py={[16, 0]}>
          <Button
            display="block"
            pos={["static", "absolute"]}
            mx={["auto", null]}
            right={[null, 8]}
            bottom={[null, 8]}
          >
            Shop All CBD
          </Button>
        </Box>
      </Box>
      <Box pt={40}>
        <Container centerContent mb={20}>
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
        <Flex gap={20} flexDir={["column-reverse", "row"]}>
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
            <Heading fontSize={[114, 220]} fontFamily={"Futura"}>
              TOR
            </Heading>
          </Box>
          <Box maxW={["auto", "400"]} p={[8]}>
            <Testimonials />
          </Box>
        </Flex>
        <Box py={40} height={["auto", 800]} pos="relative">
          <Container maxW="container.xl">
            <Stack maxW="560px" spacing={4}>
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
                specific challenges of each hair type.
              </Text>
              <NextLink href={"/about"} passHref>
                <Button alignSelf={"flex-start"}>About Us</Button>
              </NextLink>
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
        <Stack
          maxW="560px"
          py={[8, 80]}
          spacing={4}
          pos={["static", "absolute"]}
          right={[0, 20]}
          px={[4, 0]}
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
                <Icon as={FiGift} boxSize={8} />
                <Text>Special Offers</Text>
              </Box>
            </HStack>
          </Box>
        </Stack>
      </Box>
      <Container maxW="container.xl" pb={40} mt={20}>
        <Heading textAlign={"center"}>Follow us on Instagram!</Heading>
        <Box textAlign={"center"} my={6}>
          <Link
            href="https://www.instagram.com/tor_salonproducts/"
            target="_blank"
          >
            <Button>Follow</Button>
          </Link>
        </Box>
        {typeof window && (
          <>
          <div className="embedsocial-hashtag" data-ref="e809ba879b57c02fc17f2171500c0a089e3ea49f"></div>
          <Script id="embedscript">{`(function(d, s, id){var js; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "https://embedsocial.com/cdn/ht.js"; d.getElementsByTagName("head")[0].appendChild(js);}(document, "script", "EmbedSocialHashtagScript"));`}</Script>
          </>
        )}
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
      maxW={280}
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
        <Heading fontSize="2xl">{name}</Heading>
        <Text>{formatter.format(parseInt(price))}</Text>
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
            maxW={340}
            mx="auto"
          >
            <Heading>{name}</Heading>
            <Text fontSize={24}>{formatter.format(parseInt(price))}</Text>
          </MotionBox>
        </MotionBox>
      </NextLink>
    </GridItem>
  );
};

const Testimonials = () => {
  const controls = useAnimation();

  const testimonials = [
    "I stopped washing my hair, for almost a year, because I wanted to feel my natural hair. TOR's Medium/Thick line are the only products that actually leave my hair feeling truly natural.",
    "It's literally the only conditioner I've found that actually washes out. TOR's products work great on my beard as well!",
  ];

  const [[page, direction], setPage] = useState([0, 0]);

  const index = wrap(0, testimonials.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <MotionBox>
      <Text fontSize={36} textTransform="uppercase">
        Testimonials
      </Text>
      <AnimatePresence exitBeforeEnter>
        <MotionText
          fontSize={18}
          fontStyle={"italic"}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          key={page}
        >
          {testimonials[index]}
        </MotionText>
      </AnimatePresence>
      <HStack gap={4}>
        <a onClick={() => paginate(-1)}>←</a>
        <a onClick={() => paginate(1)}>→</a>
      </HStack>
    </MotionBox>
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

  return {
    props: {
      // homepageData: null,
      styling: res.styling.products.edges,
      collection: res.featured,
      products: res.featured.products.edges,
      body: res.body.products.edges,
    },
    revalidate: 60,
  };
}
