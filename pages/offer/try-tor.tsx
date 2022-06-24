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
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import NextImage from "next/image";

const hairTypeData = {
  curly: {
    variantId: "gid://shopify/ProductVariant/43618533409014",
    color: "#E4D5D4",
    title: "TOR for Curly Hair",
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
  },
  medium: {
    variantId: "gid://shopify/ProductVariant/43618533441782",
    color: "#D7E1DC",
    title: "TOR for Medium & Thick Hair",
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

export default function TryTor() {
  const [hairType, setHairType] = useState<null | string>(null);

  return (
    <>
      <Box h={[350, 500]}>
        <Container h="full" display="flex" flexDir="column">
          <Flex align="center" justify="stretch" flexGrow={1}>
            <Heading size="3xl" lineHeight={1.2}>
              Try TOR&apos;s Custom Hair Care for $12!
            </Heading>
          </Flex>
          <Text textAlign={"right"}>+ shipping &amp; taxes</Text>
        </Container>
      </Box>
      <Container py={[10, 20]} centerContent>
        <Select
          placeholder="Select your hair type"
          onChange={(e) => setHairType(e.target.value)}
          value={hairType ? hairType : ""}
        >
          <option value="curly">Your Type: Curly</option>
          <option value="fine">Your Type: Fine/Thin</option>
          <option value="medium">Your Type: Medium/Thick</option>
        </Select>
        <Button my={5} disabled={!hairType} size="lg">
          {!hairType ? "Select your hair type" : "Add To Cart"}
        </Button>
      </Container>
      <Box>
        <Container py={[10, 20]}>
          <Heading size="2xl" textAlign={"center"}>
            Made Just For You
          </Heading>
        </Container>
      </Box>
      <Box bgColor={hairType ? hairTypeData[hairType].color : "white"}>
        <SimpleGrid templateColumns={"repeat(3, 1fr)"} textAlign="center">
          <GridItem
            onClick={() => setHairType("curly")}
            display="grid"
            placeItems="center"
            p={8}
            bgColor={hairTypeData.curly.color}
          >
            <Text>Curly</Text>
          </GridItem>
          <GridItem
            onClick={() => setHairType("fine")}
            display="grid"
            placeItems="center"
            p={8}
            bgColor={hairTypeData.fine.color}
          >
            <Text>Fine &amp; Thin</Text>
          </GridItem>
          <GridItem
            onClick={() => setHairType("medium")}
            display="grid"
            placeItems="center"
            p={8}
            bgColor={hairTypeData.medium.color}
          >
            <Text>Medium &amp; Thick</Text>
          </GridItem>
        </SimpleGrid>
        {hairType && (
          <AnimatePresence exitBeforeEnter>
            <MotionBox
              key={hairTypeData[hairType].color}
              bgColor={hairTypeData[hairType].color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Container py={[10, 20]}>
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
              </Container>
            </MotionBox>
          </AnimatePresence>
        )}
      </Box>
      <Container py={[10, 20]}>
        {/* add image of specific travel size bottle */}
        <Heading size="md">TOR Shampoo</Heading>
        <Text>Insert description for hair type specific shampoo?</Text>
      </Container>
      <Container py={[10, 20]}>
        {/* add image of specific travel size bottle */}
        <Heading size="md">TOR Conditioner</Heading>
        <Text>Insert description for hair type specific conditioner?</Text>
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
        <Container py={[10, 20]}>
          <Stack spacing={3} align="flex-start">
            <Box>
              <Text>Just for you</Text>
              <Heading>HD Curl Cream</Heading>
            </Box>
            <Stack direction="row" align="center">
              <Text
                fontSize="2xl"
                textDecor={"line-through"}
                color={"gray.500"}
              >
                $27.00
              </Text>
              <Text size="xl">$13.50</Text>
            </Stack>
            <Text>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta
              sed quasi officiis adipisci dolor distinctio.
            </Text>
            <Button size="lg">Add To Cart</Button>
          </Stack>
        </Container>
      </Box>
      {/* <Container>
        <SimpleGrid templateColumns={"repeat(2, 1fr)"}>
          <GridItem py={8}>
            <Text>Mousse</Text>
          </GridItem>
          <GridItem py={8}>
            <Text>Gel 2.0</Text>
          </GridItem>
          <GridItem py={8}>
            <Text>Defining Lotion</Text>
          </GridItem>
          <GridItem py={8}>
            <Text>Hair Spray</Text>
          </GridItem>
        </SimpleGrid>
      </Container> */}
      <Container py={20}>
        <Stack spacing={4}>
          <Heading textAlign={"center"}>
            Created by a former TreSemme Chemist
          </Heading>
          <Text textAlign={"center"}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab sed
            repellat incidunt sint vero, impedit rem nesciunt veniam architecto
            cumque nam cum, libero neque rerum, doloremque sit. Facere, natus
            ipsam?
          </Text>
        </Stack>
      </Container>
      <Container py={[10, 20]}>
        <Stack spacing={4}>
          <Heading textAlign={"center"} size="3xl" lineHeight={1.2}>
            Ready to feel the difference?
          </Heading>
          <Select
            placeholder="Select your hair type"
            onChange={(e) => setHairType(e.target.value)}
            value={hairType ? hairType : ""}
          >
            <option value="curly">Your Type: Curly</option>
            <option value="fine">Your Type: Fine/Thin</option>
            <option value="medium">Your Type: Medium/Thick</option>
          </Select>
          <Button disabled={!hairType} size="lg">
            {!hairType ? "Select your hair type" : "Buy Now"}
          </Button>
        </Stack>
      </Container>
    </>
  );
}
