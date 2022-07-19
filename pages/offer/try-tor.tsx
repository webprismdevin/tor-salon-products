import {
  Box,
  Heading,
  Text,
  Container,
  Select,
  Button,
  List,
  ListItem,
  ListIcon,
  Stack,
  Link,
  AspectRatio,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useContext, useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import Head from "next/head";
import CartContext from "../../lib/CartContext";
import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import formatter from "../../lib/formatter";
import { hairTypeData } from "../../lib/tryTorData";
import { sanity } from "../../lib/sanity";
import { RatingStar } from "rating-star";
import { PortableText } from "@portabletext/react";
import addToCart from "../../lib/Cart/addToCart";

const MotionBox = motion(Box);

// header image DONE
// setup opitmize to test Tresemme vs Nexxus

// add to cart function DONE
// get styling products ids DONE
// styling product feature switch based on hair type DONE
// handle discounts for shipping & price discounts DONE
// hide styling product & show a select if hair type is not selected DONE

export default function TryTor({ page }: any) {
  const [hairType, setHairType] = useState<null | string>("");
  const { cart, setCart } = useContext(CartContext);

  const moreInfoRef = useRef<HTMLDivElement | null>(null);
  const typeSelectionRef = useRef<HTMLDivElement | null>(null);
  const refAddStyling = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hairType) {
      window.localStorage.removeItem(
        `${process.env.NEXT_PUBLIC_SHOP_NAME}:supershops:cart`
      );
      setCart({
        status: "dirty"
      })
      window.localStorage.setItem("tor_hairType", hairType);
    }
  }, [hairType]);

  useEffect(() => {
    let storedType = window.localStorage.getItem("tor_hairType");
    if (storedType) setHairType(storedType);
  }, []);

  async function addTryBundleToCart(variantId: string) {
    const response = await addToCart(cart.id, variantId);

    if (response) {
      setCart({
        ...cart,
        lines: response.cartLinesAdd.cart.lines,
        status: "dirty",
      });
    }
  }

  async function addStylingToCart() {
    if (hairType) {
      const response = await fetch("/api/addtocart", {
        method: "POST",
        body: JSON.stringify({
          variantId: hairTypeData[hairType].styling.variantId,
          cartId: cart.id,
          qty: 1,
        }),
      }).then((res) => res.json());

      if (response) {
        // addFreeShipping();
        console.log(response);
      }
    }
  }

  // function addFreeShipping() {
  //   const mutation = gql`
  //     mutation cartDiscountCodesUpdate(
  //       $cartId: ID!
  //       $discountCodes: [String!]
  //     ) {
  //       cartDiscountCodesUpdate(
  //         cartId: $cartId
  //         discountCodes: $discountCodes
  //       ) {
  //         cart {
  //           discountCodes {
  //             applicable
  //             code
  //           }
  //         }
  //         userErrors {
  //           field
  //           message
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     cartId: cart.id,
  //     discountCodes: ["TRYTORFREESHIPPING"],
  //   };

  //   graphClient.request(mutation, variables).then((result) => {
  //     console.log(result, " addFreeShipping");

  //     setCart({
  //       ...cart,
  //       status: "dirty",
  //     });
  //   });
  // }

  function handleButton() {
    if (hairType) {
      if (cart.lines && cart.lines.length === 0)
        addTryBundleToCart(hairTypeData[hairType!].variantId);
      if (cart.lines && cart.lines.length > 0) {
        if (process.env.NODE_ENV === "production") {
          window.dataLayer.push({
            event: "begin_checkout",
            eventCallback: () => (window.location.href = cart.checkoutUrl),
            eventTimeout: 1200,
          });
        }
        if (process.env.NODE_ENV === "development") {
          window.location.href = cart.checkoutUrl;
        }
      }
    }
    if (!hairType) {
      typeSelectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleSelection(e: any) {
    setHairType(e.target.value);
  }

  function returnButtonText() {
    if (cart.lines?.length > 0 && hairType) return "Checkout";
    if (cart.lines?.length === 0 && hairType) return "Add To Cart";
    if (!hairType) return "Select Your Hair Type";
  }

  return (
    <Box
      bgColor={hairType ? hairTypeData[hairType].color : "white"}
      transition={"background-color 0.3s ease"}
    >
      <Head>
        <title>{page.pageTitle} | TOR Salon Products</title>
        <meta name="description" content={page.metaDescription} />
      </Head>
      <Box position="relative" overflow={"hidden"}>
        <Container maxW="container.lg" py={[5, 20]}>
          <Stack
            direction={["column-reverse", "row"]}
            justify="space-between"
            align="flex-start"
            spacing={[6, 0]}
          >
            <Stack
              direction={["column"]}
              h="full"
              maxW={["full", "55%"]}
              justify={"center"}
              spacing={8}
            >
              <Box ref={typeSelectionRef}>
                <Heading size={["xl", "3xl"]} as="h1">
                  <PortableText value={page.hero.title} />
                </Heading>
                <Heading size={["lg", "xl"]} mt={[2]}>
                  <PortableText value={page.hero.subtitle} />
                </Heading>
                <Text mt={3}>{page.hero.subtext}</Text>
                <Text mt={[5]} fontSize="lg">
                  {page.hero.text}
                </Text>
              </Box>
              <Box>
                <div ref={moreInfoRef} />
                <Select
                  placeholder="❓ Select your hair type ❓"
                  onChange={handleSelection}
                  value={hairType ? hairType : ""}
                  variant="filled"
                  bg="white"
                  shadow={"lg"}
                  size="lg"
                  outline={"1px solid rgba(0,0,0,0.05)"}
                >
                  <option value="curly">Your Hair Type: Curly ✅</option>
                  <option value="fine">Your Hair Type: Fine/Thin ✅</option>
                  <option value="medium">
                    Your Hair Type: Medium/Thick ✅
                  </option>
                </Select>
                <AnimatePresence>
                  {/* {hairType && ( */}
                  <MotionBox
                    position={["fixed", "static"]}
                    bottom={4}
                    left={0}
                    w="full"
                    px={[2, 0]}
                    mt={5}
                    zIndex={2}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: "auto",
                      transition: { duration: 0.3 },
                    }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Button
                      // disabled={!hairType}
                      size="lg"
                      w={["full", "initial"]}
                      // color="black"
                      // bgColor="white"
                      shadow="lg"
                      onClick={handleButton}
                      outline={"1px solid rgba(0,0,0,0.05)"}
                    >
                      {returnButtonText()}
                    </Button>
                  </MotionBox>
                  {/* )} */}
                </AnimatePresence>
              </Box>
            </Stack>
            <Box
              width={["full", "40%"]}
              borderRadius={6}
              overflow="hidden"
              boxShadow={"lg"}
            >
              <AspectRatio ratio={1 / 1}>
                <NextImage
                  priority
                  src={
                    !hairType
                      ? "/images/trytor/AllMinis3.jpg"
                      : hairTypeData[hairType].headerImg
                  }
                  layout={"fill"}
                />
              </AspectRatio>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Box pos="relative" h={"400px"} overflow="hidden">
        <MotionBox
          pos="absolute"
          animate={{
            x: [0, -2400],
            transition: {
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 96,
                ease: "linear",
              },
            },
          }}
          minW="4800"
        >
          <Stack direction="row" align="stretch">
            {page.reviews.map((review: any) => (
              <Review
                stars={review.rating}
                key={review._id}
                review={review.review}
                name={review.name}
              />
            ))}
            {page.reviews.map((review: any) => (
              <Review
                stars={review.rating}
                key={review._id}
                review={review.review}
                name={review.name}
              />
            ))}
          </Stack>
        </MotionBox>
      </Box>
      <AnimatePresence>
        {hairType && (
          <MotionBox
            key={"offer_options"}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          >
            <Box bgColor={hairType ? hairTypeData[hairType].color : "white"}>
              <AnimatePresence exitBeforeEnter>
                <MotionBox
                  key={hairTypeData[hairType].color}
                  bgColor={hairTypeData[hairType].color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3 } }}
                  exit={{ opacity: 0 }}
                >
                  <Container pt={[10, 20]} maxW="container.lg">
                    <Stack direction={["column", "row"]} spacing={[10, 20]}>
                      <Box
                        flexShrink={0}
                        minW="30%"
                        borderRadius={6}
                        overflow="hidden"
                        boxShadow={"lg"}
                      >
                        <AspectRatio ratio={1}>
                          <NextImage
                            src={
                              !hairType
                                ? "/images/hairtypes/curly-hair-girl.jpg"
                                : hairTypeData[hairType].photo
                            }
                            layout="fill"
                          />
                        </AspectRatio>
                      </Box>
                      <Box>
                        <Heading mb={3}>{hairTypeData[hairType].title}</Heading>
                        <Text>{hairTypeData[hairType].description}</Text>
                        <List spacing={3} pt={5}>
                          {hairTypeData[hairType].benefits.map(
                            (benefit: any) => (
                              <ListItem key={benefit.text} fontSize="lg">
                                <ListIcon as={benefit.icon}></ListIcon>
                                {benefit.text}
                              </ListItem>
                            )
                          )}
                        </List>
                      </Box>
                    </Stack>
                  </Container>
                </MotionBox>
              </AnimatePresence>
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
      <Container pt={[10, 20]} pb={[20]}>
        {/* add image of specific travel size bottle */}
        <Accordion allowMultiple allowToggle borderColor={"gray.400"}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  About TOR Shampoo
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                TOR Shampoo creates a gentle, luxurious lather. Formulated from
                natural ingredients, our shampoos are color-safe, and gentle,
                while removing build-up and residue.
              </Text>
              <Text>
                Designed to be paired with our conditioning products, TOR
                Shampoo will leave your hair feeling like you just left the
                salon, and keep it that way for days.
              </Text>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  About TOR Conditioner
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text>
                TOR conditioners are engineered with the needs of different hair
                types in mind. Made without dimethicone, TOR conditioners leave
                your hair lighter, and naturally-moist, not weighted down with a
                layer of silicone.
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
      <Suspense fallback={`Loading...`}>
        <AnimatePresence>
          {hairType && (
            <MotionBox
              key={"offer_options"}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <Box bg="black" color="white" ref={refAddStyling}>
                <Container py={[10, 20]} maxW="container.lg">
                  <Stack spacing={4} textAlign="center">
                    <Heading size="lg">
                      Add a FULL-SIZE styling product for 50% OFF.
                    </Heading>
                    <Text>
                      TOR styling products work best when paired with our
                      shampoo &amp; conditioner!
                    </Text>
                  </Stack>
                </Container>
              </Box>
              <Box>
                <Container py={[10, 20]} maxW="container.lg">
                  <Stack direction={["column", "row"]} align="center">
                    <Box flexShrink={0} minW={["full", "50%"]}>
                      <AspectRatio ratio={1}>
                        <NextImage
                          src={hairTypeData[hairType].styling.photo}
                          layout="fill"
                        />
                      </AspectRatio>
                    </Box>
                    <Stack spacing={4}>
                      <Box>
                        <Text>Just for you</Text>
                        <Heading>
                          {hairTypeData[hairType].styling.title}
                        </Heading>
                      </Box>
                      <Stack direction="row" align="center">
                        <Text
                          fontSize="2xl"
                          textDecor={"line-through"}
                          color={"gray.500"}
                        >
                          {formatter.format(
                            hairTypeData[hairType].styling.price
                          )}
                        </Text>
                        <Text size="xl">
                          {formatter.format(
                            hairTypeData[hairType].styling.price / 2
                          )}
                        </Text>
                      </Stack>
                      <Text>{hairTypeData[hairType].styling.description}</Text>
                      <Button
                        size="lg"
                        alignSelf="flex-start"
                        onClick={() => addStylingToCart()}
                      >
                        Add To Cart
                      </Button>
                    </Stack>
                  </Stack>
                </Container>
              </Box>
            </MotionBox>
          )}
        </AnimatePresence>
      </Suspense>
      <Container pt={[10]} pb={[20]}>
        <Stack spacing={4}>
          <Heading textAlign={"center"}>
            Created by an award winning beauty-industry chemist.
          </Heading>
          <Text textAlign={"center"}>{page.about.text}</Text>
        </Stack>
      </Container>
      <Suspense fallback={`Loading...`}>
        <AnimatePresence>
          {hairType && (
            <MotionBox
              key={"offer_options"}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <Container
                maxW="container.lg"
                pt={[10, 20]}
                pb={[20, 40]}
                centerContent
              >
                <Stack spacing={6}>
                  <Heading textAlign={"center"} size="3xl" lineHeight={1.2}>
                    Ready to feel the difference?
                  </Heading>
                  <Button
                    disabled={!hairType}
                    size="lg"
                    maxW={480}
                    display={["none", "initial"]}
                    alignSelf={[null, "center"]}
                    shadow="lg"
                    onClick={handleButton}
                    outline={"1px solid rgba(0,0,0,0.05)"}
                  >
                    {returnButtonText()}
                  </Button>
                  <Box alignSelf="center">
                    <Review
                      stars={5}
                      review={
                        "I'm hooked! Ever since Shanon brought the shampoo & conditoner into our salon, we've pretty much stopped using everything else. Great product, keeps its promises, great for the environment, and wonderful people to do business with!"
                      }
                      name={"Lee W.S."}
                    />
                  </Box>
                </Stack>
              </Container>
            </MotionBox>
          )}
        </AnimatePresence>
      </Suspense>
      <Box py={20} bgColor={"black"} color={"white"}>
        <Text w="full" textAlign={"center"} fontSize="xs">
          © TOR Salon &amp; Spa Products. 2022. Crafted by{" "}
          <NextLink href="https://webprism.co" passHref>
            <Link>WEBPRISM</Link>
          </NextLink>
        </Text>
      </Box>
    </Box>
  );
}

function Review({
  stars,
  review,
  name,
}: {
  stars: number;
  review: string;
  name: string;
}) {
  return (
    <Stack
      align="flex-start"
      padding={8}
      bgColor="white"
      shadow="lg"
      borderRadius={6}
      outline={"1px solid rgba(0,0,0,0.05)"}
      maxW={["95vw", 400]}
    >
      <RatingStar rating={stars} id={"rating_star"} />
      <Text fontStyle={"italic"}>&quot;{review}&quot;</Text>
      <Text alignSelf="flex-end" fontStyle="italic">
        - {name}
      </Text>
    </Stack>
  );
}

export async function getStaticProps() {
  const query = `*[_type == "tryTor"][0]{..., reviews[]->}`;

  const result = await sanity.fetch(query);

  return {
    props: {
      page: result,
    },
  };
}
