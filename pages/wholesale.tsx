import {
  Box,
  Button,
  Container,
  Divider,
  GridItem,
  Heading,
  IconButton,
  Select,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Image,
} from "@chakra-ui/react";
import { gql, GraphQLClient } from "graphql-request";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../lib/auth-context";
import CartContext from "../lib/CartContext";
import formatter from "../lib/formatter";
import graphClient from "../lib/graph-client";

interface OrderObject {
  pid: string;
  vid: string;
  qty: number;
}

// add link to instruction video in header
// add other benefits
// add shipping policy for wholesale orders
// add total price (MSRP & wholesale)
// add link to download retail & wholesale pricing guide PDF

export default function Wholesale({ products }: any) {
  const [type, setType] = useState("");
  const [filteredProducts, setProducts] = useState(products);
  const { cart, setCart } = useContext(CartContext);

  const typeSet = new Set(
    products.map((product: any) => product.node.productType)
  );

  async function addToCart(vid: string) {
    const response = await fetch("/api/addtocart", {
      method: "POST",
      body: JSON.stringify({
        variantId: vid,
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

  useEffect(() => {
    if (type === "") setProducts(products);

    if (type !== "")
      setProducts(
        products.filter((prod: any) => prod.node.productType === type)
      );
  }, [type]);

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
        discountCodes: ["WHOLESALE50"],
      };

      graphClient
        .request(mutation, variables)
        .then((result) => console.log(result));
    }
  }, [cart]);

  return (
    <Container py={20} maxW="container.xl">
      <Head>
        <title>Order Wholesale | TOR Salon Products</title>
      </Head>
      <Stack py={10}>
        <Heading as="h1" size="2xl">
          Order Wholesale
        </Heading>
      </Stack>
      <Stack direction="column" spacing={10} align="flex-start" pos="relative">
        <Stack spacing={4}>
          <Heading size="lg">Filters</Heading>
          <Select maxW={300} onChange={(e) => setType(e.target.value)}>
            <option value="">Show all</option>
            {Array.from(typeSet).map((pt: any) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </Select>
        </Stack>
        <SimpleGrid gap={6} w="full" templateColumns={"repeat(4, 1fr)"}>
          {filteredProducts.map((p: any) => (
            <GridItem key={p.node.id} p={6} shadow="md" colSpan={2}>
              <Stack justify={"space-between"} direction="row">
                <Image
                  src={p.node.images.edges[0].node.url}
                  maxW={"40%"}
                  alt={p.node.title}
                />
                <Stack align={"flex-start"} flexGrow={1}>
                  <Tag size="sm">{p.node.productType}</Tag>
                  <Text fontWeight={600} fontSize="2xl">
                    {p.node.title}
                  </Text>
                  <Divider />
                  {p.node.variants.edges.map((v: any) => (
                    <Stack
                      w="full"
                      direction="row"
                      key={v.node.id}
                      align="center"
                      justify={"space-between"}
                    >
                      <Text>
                        {v.node.title === "Default Title"
                          ? "One size"
                          : v.node.title}
                      </Text>
                      <Stack direction="row" align="center">
                        <Text>
                          {formatter.format(v.node.priceV2.amount / 2)}
                        </Text>
                        <Button onClick={() => addToCart(v.node.id)} size="sm">
                          Add To Cart
                        </Button>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </GridItem>
          ))}
        </SimpleGrid>
      </Stack>
    </Container>
  );
}

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
      products(
        first: 200
        query: "tag_not:Bundle AND tag_not:gift_card AND NOT product_type:Candles"
        sortKey: PRODUCT_TYPE
      ) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            variants(first: 3) {
              edges {
                node {
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
  `;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  return {
    props: {
      products: res.products.edges,
    },
    revalidate: 60,
  };
}
