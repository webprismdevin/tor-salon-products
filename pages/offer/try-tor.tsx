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
  HStack,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import Head from "next/head";
import CartContext from "../../lib/CartContext";
import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import formatter from "../../lib/formatter";
import { hairTypeData } from "../../lib/tryTorData";

const MotionBox = motion(Box);

// header image DONE
// setup opitmize to test Tresemme vs Nexxus

// add to cart function DONE
// get styling products ids DONE
// styling product feature switch based on hair type DONE
// handle discounts for shipping & price discounts DONE
// hide styling product & show a select if hair type is not selected DONE

export default function TryTor() {
  const [hairType, setHairType] = useState<null | string>(null);
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    if (hairType) window.localStorage.setItem("tor_hairType", hairType);
  }, [hairType]);

  useEffect(() => {
    let storedType = window.localStorage.getItem("tor_hairType");

    if (storedType) setHairType(storedType);
  }, []);

  async function addTryBundleToCart(variantId: string) {
    const response = await fetch("/api/addtocart", {
      method: "POST",
      body: JSON.stringify({
        variantId: variantId,
        cartId: cart.id,
        qty: 1,
      }),
    }).then((res) => res.json());

    const mutation = gql`
      mutation cartDiscountCodesUpdate(
        $cartId: ID!
        $discountCodes: [String!]
      ) {
        cartDiscountCodesUpdate(
          cartId: $cartId
          discountCodes: $discountCodes
        ) {
          cart {
            discountCodes {
              applicable
              code
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId: cart.id,
      discountCodes: ["TRYTORFOR12"],
    };

    graphClient.request(mutation, variables).then((result) => {
      setCart({
        ...cart,
        status: "dirty",
      });
    });
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
        addFreeShipping();
        console.log(response);
      }
    }
  }

  function addFreeShipping() {
    const mutation = gql`
      mutation cartDiscountCodesUpdate(
        $cartId: ID!
        $discountCodes: [String!]
      ) {
        cartDiscountCodesUpdate(
          cartId: $cartId
          discountCodes: $discountCodes
        ) {
          cart {
            discountCodes {
              applicable
              code
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId: cart.id,
      discountCodes: ["TRYTORFREESHIPPING"],
    };

    graphClient.request(mutation, variables).then((result) => {
      console.log(result, " addFreeShipping");

      setCart({
        ...cart,
        status: "dirty",
      });
    });
  }

  return (
    <Box
      bgColor={hairType ? hairTypeData[hairType].color : "white"}
      transition={"background-color 0.3s ease"}
    >
      <Head>
        <title>Try TOR for $12! | TOR Salon Products</title>
        <meta name="description" content="" />
      </Head>
      <Box position="relative" overflow={"hidden"}>
        <Container maxW="container.lg" py={[10, 20]}>
          <Stack
            direction={["column-reverse", "row"]}
            justify="space-between"
            align="flex-start"
            spacing={[6, 0]}
          >
            <Stack
              direction={["column"]}
              h="full"
              maxW={["full", "50%"]}
              justify={"center"}
              spacing={8}
            >
              <Box>
                <Heading size={["xl", "2xl"]}>
                  Try TOR Shampoo &amp; Conditioner for $12!
                </Heading>
                <Text
                  textAlign={["left", "right"]}
                  mt={3}
                  pr={[0, null, null, 4]}
                >
                  + shipping &amp; taxes
                </Text>
                <Text mt={[5]}>
                  Say hello to the sexiest second-day hair you&apos;ve ever had.
                  Try our shampoo and conditioner, formulated for your hair
                  type. Only $12!
                </Text>
              </Box>
              <Box>
                <Select
                  placeholder="Select your hair type to see more"
                  onChange={(e) => setHairType(e.target.value)}
                  value={hairType ? hairType : ""}
                  variant="filled"
                  bg="white"
                  shadow={"lg"}
                  size="lg"
                >
                  <option value="curly">Your Hair Type: Curly</option>
                  <option value="fine">Your Hair Type: Fine/Thin</option>
                  <option value="medium">Your Hair Type: Medium/Thick</option>
                </Select>
                <AnimatePresence>
                  {hairType && (
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
                        disabled={!hairType}
                        size="lg"
                        w={["full", "initial"]}
                        color="black"
                        bgColor="white"
                        shadow="xl"
                        onClick={() => {
                          if (hairType)
                            addTryBundleToCart(
                              hairTypeData[hairType].variantId
                            );
                        }}
                      >
                        {!hairType ? "Select your hair type" : "Add To Cart"}
                      </Button>
                    </MotionBox>
                  )}
                </AnimatePresence>
              </Box>
              <Box padding={8} bgColor="white" shadow="lg" borderRadius={6}>
                <HStack>
                  <Text>★</Text>
                  <Text>★</Text>
                  <Text>★</Text>
                  <Text>★</Text>
                  <Text>★</Text>
                </HStack>
                <Text
                  mt={2}
                  style={{ hangingPunctuation: "first", paddingLeft: "3rem 0" }}
                  fontStyle={"italic"}
                >
                  &quot;I have been using Tor products for the last few years.
                  My hair is so amazingly healthy and shiny . Love the timely
                  delivery on this product also. Highly recommend!&quot;
                </Text>
                <Text textAlign={"right"} fontStyle="italic">
                  - Kelly. K
                </Text>
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
              {/* {hairType && ( */}
              <AnimatePresence exitBeforeEnter>
                <MotionBox
                  key={hairTypeData[hairType].color}
                  bgColor={hairTypeData[hairType].color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.3 } }}
                  exit={{ opacity: 0 }}
                >
                  <Container py={[10, 20]} maxW="container.lg">
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
                              <ListItem key={benefit.text} fontSize="lg" >
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
              {/* )} */}
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
      <Container py={[10, 20]}>
        {/* add image of specific travel size bottle */}
        <Box>
          <Heading size="md">About TOR Shampoo</Heading>
          <Text my={5}>
            TOR Shampoo creates a gentle, luxurious lather. Formulated from
            natural ingredients, our shampoos are color-safe, and gentle, while
            removing build-up and residue.
          </Text>
          <Text>
            Designed to be paired with our conditioning products, TOR Shampoo
            will leave your hair feeling like you just left the salon, and keep
            it that way for days.
          </Text>
        </Box>
      </Container>
      <Container pb={[10, 20]}>
        {/* add image of specific travel size bottle */}
        <Box>
          <Heading size="md">About TOR Conditioner</Heading>
          <Text mt={5}>
            TOR conditioners are engineered with the needs of different hair
            types in mind. Made without dimethicone, TOR conditioners leave your
            hair lighter, and naturally-moist, not weighted down with a layer of
            silicone.
          </Text>
        </Box>
      </Container>
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
            <Box bg="black" color="white">
              <Container py={[10, 20]}>
                <Stack spacing={4}>
                  <Heading size="lg">
                    Add a FULL-SIZE styling product for 50% OFF. Unlock FREE
                    SHIPPING for your entire order!
                  </Heading>
                  <Text>
                    TOR styling products work best when paired with our shampoo
                    &amp; conditioner!
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
                      <Heading>{hairTypeData[hairType].styling.title}</Heading>
                    </Box>
                    <Stack direction="row" align="center">
                      <Text
                        fontSize="2xl"
                        textDecor={"line-through"}
                        color={"gray.500"}
                      >
                        {formatter.format(hairTypeData[hairType].styling.price)}
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
      <Container py={20}>
        <Stack spacing={4}>
          <Heading textAlign={"center"}>
            Created by an award winning beauty-industry chemist.
          </Heading>
          <Text textAlign={"center"}>
            TOR Salon Products was founded by Shannon Tor, a former
            Alberto-Culver &amp; Avon product who lead product development for
            Nexxus, Tresemme, and other major beauty brands.{" "}
          </Text>
        </Stack>
      </Container>
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
              <Stack spacing={4}>
                <Heading textAlign={"center"} size="3xl" lineHeight={1.2}>
                  Ready to feel the difference?
                </Heading>
                <Button
                  disabled={!hairType}
                  size="lg"
                  maxW={480}
                  display={["none", "initial"]}
                  alignSelf={[null, "center"]}
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      left: 0,
                      behavior: "smooth",
                    })
                  }
                >
                  Scroll To Top
                </Button>
                <Box
                  maxW={[560]}
                  alignSelf="center"
                  padding={8}
                  bgColor="white"
                  shadow="lg"
                >
                  <HStack>
                    <Text>★</Text>
                    <Text>★</Text>
                    <Text>★</Text>
                    <Text>★</Text>
                    <Text>★</Text>
                  </HStack>
                  <Text
                    borderRadius={6}
                    mt={2}
                    style={{
                      hangingPunctuation: "first",
                      paddingLeft: "3rem 0",
                    }}
                    fontStyle={"italic"}
                  >
                    &quot;I&apos;m hooked! Ever since Shanon brought the shampoo
                    &amp; conditoner into our salon, we&apos;ve pretty much
                    stopped using everything else. Great product, keeps its
                    promises, great for the environment, and wonderful people to
                    do business with!&quot;
                  </Text>
                  <Text textAlign={"right"} fontStyle="italic">
                    - Lee W.S.
                  </Text>
                </Box>
              </Stack>
            </Container>
          </MotionBox>
        )}
      </AnimatePresence>
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
