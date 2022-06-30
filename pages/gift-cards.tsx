import {
  Heading,
  Box,
  Container,
  Flex,
  Stack,
  Text,
  AspectRatio,
  Image,
  ImageProps,
  Select,
  Button,
  useNumberInput,
  HStack,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import React, { useState, useContext, useEffect } from "react";
import CartContext from "../lib/CartContext";
import formatter from "../lib/formatter";
import { GetStaticProps } from "next";
import Product from "../components/Product/Product";
import Script from "next/script";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { wrap } from "@popmotion/popcorn";

declare interface VariantType {
  id: string;
  priceV2: {
    amount: string;
  };
  title: string;
  availableForSale: boolean;
}

export default function GiftCards({ product }: any) {
  // const [itemQty, setItemQty] = useState(1);
  const { cart, setCart } = useContext(CartContext);
  // const [yjsLoaded, setLoaded] = useState(false);
  const [activeVariant, setActiveVariant] = useState<VariantType>(() => {
    if (!product) return null;

    return product.variants.edges[0].node;
  });

  // const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
  //   useNumberInput({
  //     step: 1,
  //     defaultValue: itemQty,
  //     min: 1,
  //     precision: 0,
  //     onChange: (valueAsString: string, valueAsNumber: number) =>
  //       setItemQty(valueAsNumber),
  //   });

  // const inc = getIncrementButtonProps();
  // const dec = getDecrementButtonProps();
  // const input = getInputProps();

  const variants = product?.variants.edges;

  async function addToCart() {
    const response = await fetch("/api/addtocart", {
      method: "POST",
      body: JSON.stringify({
        variantId: activeVariant.id,
        cartId: cart.id,
        qty: 1,
      }),
    }).then((res) => res.json());

    setCart({
      ...cart,
      status: "dirty",
      lines: response.response.cartLinesAdd.cart.lines,
    });
  }

  function handleActiveVariantChange(id: string) {
    const cv = variants.filter((v: any) => v.node.id === id);
    setActiveVariant(cv[0].node);
  }

  if (!product) return null;

  return (
    <>
      <Head>
        <title>{product.title} | TOR Salon Products</title>
        <meta
          name="description"
          content={`${product.description.substring(0, 200)}...`}
        />
      </Head>
      <Flex flexDirection={["column", "row"]} pb={20}>
        <AspectRatio ratio={1/1} maxW={["100%", "50%"]} minW={["100%", "50%"]}>
            <Image src={product.images.edges[0]?.node.url} alt="TOR Gift Card" objectFit="fill" />
        </AspectRatio>
        <Container centerContent pt={[0, 40]} pb={20}>
          <Stack direction={["column"]} spacing={4} w="full" align="flex-start">
            <Heading as="h1" maxW={500}>
              {product.title}
            </Heading>
            <Box
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
            />
            <Stack
              direction={"row"}
              align="flex-end"
              justify={"center"}
              flexShrink={1}
            >
              {variants.length > 1 && (
                <Stack>
                  <Heading as="h4" size="md" mb={3} ml={2}>
                    Select An Amount
                  </Heading>
                  <Select
                    minW={"240px"}
                    value={activeVariant.id}
                    onChange={(e) => {
                      handleActiveVariantChange(e.target.value);
                    }}
                  >
                    {variants.map((v: { node: VariantType }, i: number) => (
                      <option key={v.node.id} value={v.node.id}>
                        {v.node.title}
                      </option>
                    ))}
                  </Select>
                </Stack>
              )}
            </Stack>
            <Text fontSize={24} fontWeight={600}>
              {formatter.format(parseInt(activeVariant.priceV2.amount))}
            </Text>
            <Button
              onClick={addToCart}
              isDisabled={!activeVariant?.availableForSale}
            >
              {activeVariant?.availableForSale ? "Add To Cart" : "Sold Out!"}
            </Button>
          </Stack>
        </Container>
      </Flex>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const handle = context.params?.handle;

  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
      },
    }
  );

  // Shopify Request
  const query = gql`{
      product(handle: "gift-cards") {
        id
        title
        descriptionHtml
        description
        tags
        variants(first: 100) {
          edges {
            node {
              availableForSale
              id
              title
              priceV2 {
                amount
              }
            }
          }
        }
        images(first: 2) {
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
        }
      }
    }`;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve product. Please check logs");
  }

  return {
    props: {
      product: res.product,
    },
    revalidate: 60,
  };
};
