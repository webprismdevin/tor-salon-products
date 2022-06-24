import {
  Box,
  Heading,
  Text,
  Container,
  Flex,
  Select,
  Button,
  SimpleGrid,
  GridItem,
  List,
  ListItem,
  ListIcon,
  Stack,
  Link,
  chakra,
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

const CharkaNI = chakra(NextImage);

const hairTypeData = {
  curly: {
    variantId: "gid://shopify/ProductVariant/43618533409014",
    color: "#E4D5D4",
    title: "TOR for Curly Hair",
    description:
      "TOR's Curly Line has been specifically formulated to address the unique needs of curly hair - to balance curls, increase definition, bounce, shine, and moisture, while protecting against breakage and frizz.",
    benefits: [
      {
        icon: "",
        text: "Longer-lasting style",
      },
      {
        icon: "",
        text: "Amazing Frizz Control",
      },
      {
        icon: "",
        text: "Superior Breakage Protection",
      },
    ],
    photo: "/images/hairtypes/curly-hair-girl.jpg",
    styling: {
      variantId: "gid://shopify/Product/7668184285430",
      photo: "/images/trytor/styling/CHD150ml.png",
      title: "HD Curl Cream",
      description:
        "TOR HD Curl Cream for Curly Hair is designed to make curls stand out with a soft hold while conditioning and defining both curls and waves. This versatile cream was designed for consumers that have naturally curly or permed hair. It enhances natural texture and provides incredible humidity resistance while making curls touchable and frizz free.",
      price: 27,
    },
  },
  medium: {
    variantId: "gid://shopify/ProductVariant/43618533441782",
    color: "#D7E1DC",
    title: "TOR for Medium & Thick Hair",
    description:
      "TOR's Medium/Thick Line has been specifically formulated to address the unique needs of medium density and thick hair, creating shine, protecting, and moisturizing, without added weight. The end result is silky, soft, manageable hair.",
    benefits: [
      {
        icon: "",
        text: "Easier Styling",
      },
      {
        icon: "",
        text: "Naturally Detangling",
      },
      {
        icon: "",
        text: "Luxe Lather",
      },
    ],
    photo: "/images/hairtypes/thick-hair-girl.jpg",
    styling: {
      variantId: "gid://shopify/Product/7668189823222",
      photo: "/images/trytor/styling/MTmilk150ml.png",
      title: "Styling Milk",
      description:
        "TOR Styling Milk for Medium/Thick hair is designed to provide maximum styling versatility. It can help create any desired style while keeping a natural look and movement. Styling Milk works equally well for diffusing to create natural waves or a beach look, increasing volume, or smoothing straight hair. This all-in-one styling provides all the benefits of a cream with the control of the gel and the definition of a mousse in a cream base.",
      price: 24,
    },
  },
  fine: {
    variantId: "gid://shopify/ProductVariant/43618533409014",
    color: "#E4E2DB",
    title: "TOR for Fine & Thin Hair",
    description:
      "TOR's Fine/Thin Line has been specifically formulated to address the unique needs of fine and thin hair, to create voluptuous, soft, manageable hair with shine.",
    benefits: [
      {
        icon: "",
        text: "No build-up",
      },
      {
        icon: "",
        text: "Naturally moisturizing",
      },
      {
        icon: "",
        text: "Maximum volume",
      },
    ],
    photo: "/images/hairtypes/fine-hair-girl.jpg",
    styling: {
      variantId: "gid://shopify/Product/7668183367926",
      photo: "/images/trytor/styling/FTSpray_300ml.png",
      title: "Anti-Static Hair Spray",
      description:
        "TOR Anti-Static Styling spray help you build that body/style without the fear of static. This light hold spray provides flexible styling and manageability without stiff hold. It provides flexible control so the style is held in place; yet comb and brush easily without flaking. After brushing, hair is soft, flexible and fuller with a natural, healthy look.",
      price: 24,
    },
  },
} as any;

const MotionBox = motion(Box);

// todo
// header image
// add to cart function
// get styling products ids
// styling product feature switch based on hair type
// handle discounts for shipping & price discounts
// hide styling product & show a select if hair type is not selected
// setup opitmize to test Tresemme vs Nexxus

export default function TryTor() {
  const [hairType, setHairType] = useState<null | string>(null);
  const { cart, setCart } = useContext(CartContext);

  useEffect(() => {
    if (cart && cart.id) {
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

      graphClient
        .request(mutation, variables)
        .then((result) => console.log(result));
    }
  }, [cart]);

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

    graphClient
      .request(mutation, variables)
      .then((result) => console.log(result));
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
              >
                {!hairType ? "Select your hair type" : "Add To Cart"}
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
      {/* <Box>
        <Container py={[10, 20]}>
          <Heading size="2xl" textAlign={"center"}>
            Made Just For You
          </Heading>
        </Container>
      </Box> */}
      <Box bgColor={hairType ? hairTypeData[hairType].color : "white"}>
        {/* <SimpleGrid templateColumns={"repeat(3, 1fr)"} textAlign="center">
          <GridItem
            onClick={() => setHairType("curly")}
            display="grid"
            placeItems="center"
            p={8}
            bgColor={hairTypeData.curly.color}
          >
            <Text
              opacity={hairType === "curly" ? 1 : 0.6}
              transition={"opacity 0.3s ease"}
            >
              Curly
            </Text>
          </GridItem>
          <GridItem
            onClick={() => setHairType("fine")}
            display="grid"
            placeItems="center"
            p={8}
            bgColor={hairTypeData.fine.color}
          >
            <Text
              opacity={hairType === "fine" ? 1 : 0.6}
              transition={"opacity 0.3s ease"}
            >
              Fine &amp; Thin
            </Text>
          </GridItem>
          <GridItem
            onClick={() => setHairType("medium")}
            display="grid"
            placeItems="center"
            p={8}
            bgColor={hairTypeData.medium.color}
          >
            <Text
              opacity={hairType === "medium" ? 1 : 0.6}
              transition={"opacity 0.3s ease"}
            >
              Medium &amp; Thick
            </Text>
          </GridItem>
        </SimpleGrid> */}
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
                    {hairTypeData[hairType].styling.price}
                  </Text>
                  <Text size="xl">
                    {hairTypeData[hairType].styling.price / 2}
                  </Text>
                </Stack>
                <Text>{hairTypeData[hairType].styling.description}</Text>
                <Button size="lg" alignSelf="flex-start">Add To Cart</Button>
              </Stack>
            </Stack>
          </Container>
        )}
      </Box>
      <Container py={20}>
        <Stack spacing={4}>
          <Heading textAlign={"center"}>
            Created by a TreSemme Chemist
          </Heading>
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
