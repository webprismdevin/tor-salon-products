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
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import Head from "next/head";
import CartContext from "../../lib/CartContext";
import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import formatter from "../../lib/formatter";
import { hairTypeData } from "../../lib/tryTorData";

const MotionBox = motion(Box);

// header image
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
    if(hairType) window.localStorage.setItem("tor_hairType", hairType)
  }, [hairType])

  useEffect(() => {
    let storedType = window.localStorage.getItem("tor_hairType");

    if(storedType) setHairType(storedType)
  }, [])

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

    setCart({
      ...cart,
      status: "dirty",
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
        addFreeShipping()
        console.log(response)
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
      console.log(result, " addFreeShipping")

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
      <Box>
        <Container
          h="full"
          display="flex"
          flexDir="column"
          maxW="container.xl"
          py={[20]}
        >
          <Stack
            direction={["column"]}
            h="full"
            maxW={["full", "50%"]}
            justify={"center"}
            spacing={8}
          >
            <Box>
              <Heading size="3xl" lineHeight={1.2}>
                Try TOR&apos;s Custom Hair Care for $12!
              </Heading>
              <Text textAlign={["left", "right"]} pr={[0, null, null, 20]}>
                + shipping &amp; taxes
              </Text>
            </Box>
            <Box maxW={[470]}>
              <Select
                placeholder="Select your hair type"
                onChange={(e) => setHairType(e.target.value)}
                value={hairType ? hairType : ""}
              >
                <option value="curly">Your Type: Curly</option>
                <option value="fine">Your Type: Fine/Thin</option>
                <option value="medium">Your Type: Medium/Thick</option>
              </Select>
              <Button
                mt={5}
                disabled={!hairType}
                size="lg"
                w={["full", "initial"]}
                onClick={() => {
                  if (hairType)
                    addTryBundleToCart(hairTypeData[hairType].variantId);
                }}
              >
                {!hairType ? "Select your hair type" : "Add To Cart"}
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Box bgColor={hairType ? hairTypeData[hairType].color : "white"}>
        {hairType && (
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
                  <Box flexShrink={0} minW="30%">
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
                      {hairTypeData[hairType].benefits.map((benefit: any) => (
                        <ListItem key={benefit.text}>
                          <ListIcon as={benefit.icon}></ListIcon>
                          {benefit.text}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Stack>
              </Container>
            </MotionBox>
          </AnimatePresence>
        )}
      </Box>
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
      <Box bg="black" color="white">
        <Container py={[10, 20]}>
          <Stack spacing={4}>
            <Heading size="lg">
              Add a styling product for 50% OFF. Unlock FREE SHIPPING for your
              entire order!
            </Heading>
            <Text>
              TOR styling products work best when paired with our shampoo &amp;
              conditioner!
            </Text>
          </Stack>
        </Container>
      </Box>
      <Box>
        {hairType && (
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
                    {formatter.format(hairTypeData[hairType].styling.price / 2)}
                  </Text>
                </Stack>
                <Text>{hairTypeData[hairType].styling.description}</Text>
                <Button
                  size="lg"
                  alignSelf="flex-start"
                  onClick={() =>
                    addStylingToCart()
                  }
                >
                  Add To Cart
                </Button>
              </Stack>
            </Stack>
          </Container>
        )}
      </Box>
      <Container py={20}>
        <Stack spacing={4}>
          <Heading textAlign={"center"}>Created by a TreSemme Chemist</Heading>
          <Text textAlign={"center"}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab sed
            repellat incidunt sint vero, impedit rem nesciunt veniam architecto
            cumque nam cum, libero neque rerum, doloremque sit. Facere, natus
            ipsam?
          </Text>
        </Stack>
      </Container>
      <Container maxW="container.lg" pt={[10, 20]} pb={[20, 40]} centerContent>
        <Stack spacing={4}>
          <Heading textAlign={"center"} size="3xl" lineHeight={1.2}>
            Ready to feel the difference?
          </Heading>
          <Select
            alignSelf={[null, "center"]}
            placeholder="Select your hair type"
            onChange={(e) => setHairType(e.target.value)}
            value={hairType ? hairType : ""}
            maxW={480}
          >
            <option value="curly">Your Type: Curly</option>
            <option value="fine">Your Type: Fine/Thin</option>
            <option value="medium">Your Type: Medium/Thick</option>
          </Select>
          <Button
            disabled={!hairType}
            size="lg"
            maxW={480}
            alignSelf={[null, "center"]}
          >
            {!hairType ? "Select your hair type" : "Buy Now"}
          </Button>
        </Stack>
      </Container>
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
