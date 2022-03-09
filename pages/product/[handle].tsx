import {
  Heading,
  Box,
  Container,
  Flex,
  Stack,
  Text,
  AspectRatio,
  Image,
  Select,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import { useState, useContext } from "react";
import getLocalCart from "../../lib/get-cart";
import CartContext from "../../lib/CartContext";
import formatter from "../../lib/formatter";
import { GetStaticProps } from "next";
// import { getProducts } from "@supershops/get-products"

const Product = ({ handle, product }: { handle: string; product: any }) => {
  const { cart, setCart } = useContext(CartContext);
  const [variantId, setVariantId] = useState(() => {
    if (!product) return null;

    return product.variants.edges[0].node.id;
  });

  const variants = product?.variants.edges;

  async function addToCart() {
    // console.log(getLocalCart)
    // let cart = await getLocalCart();

    console.log(cart);

    const response = await fetch("/api/addtocart", {
      method: "POST",
      body: JSON.stringify({
        variantId: variantId,
        cartId: cart.id,
      }),
    }).then((res) => res.json());

    setCart({
      ...cart,
      status: "dirty",
      lines: response.response.cartLinesAdd.cart.lines,
    });
  }

  function checkPrice(id: string) {
    console.log(id);

    const cv = variants.filter((v: any) => v.node.id === id);

    console.log(cv);

    return formatter.format(cv[0].node.priceV2.amount);
  }

  if (!product) return null;

  return (
    <>
      <Head>
        <title>{product.title} | SuperShops by WEBPRISM</title>
      </Head>
      <Flex flexDirection={["column", "row"]}>
        <AspectRatio ratio={1} maxW={["100%", "50%"]} minW={["100%", "50%"]}>
          <Image
            src={product.images.edges[0].node.src}
            alt={``}
            objectFit="cover"
            objectPosition="top center"
          />
        </AspectRatio>
        <Container centerContent pt={40} pb={20}>
          <Stack direction={["column"]} spacing={8} w="full">
            <Heading>{product.title}</Heading>
            <Text
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml
              }}
            />
            <div
              className="yotpo bottomLine"
              data-yotpo-product-id={product.id}
            ></div>
            <Box>
              <Heading as="h4" size="md" mb={3} ml={2}>
                Select Your Size
              </Heading>
              <Select
                value={variantId}
                onChange={(e) => {
                  setVariantId(e.target.value);
                  checkPrice(e.target.value);
                }}
              >
                {variants.map((v: any, i: number) => (
                  <option key={v.node.id} value={v.node.id}>
                    {v.node.title}
                  </option>
                ))}
              </Select>
            </Box>
            <Text fontSize={24} fontWeight={600}>
              {checkPrice(variantId)}
            </Text>
            <Button onClick={addToCart}>Add To Cart</Button>
          </Stack>
        </Container>
      </Flex>
      <Container maxW="container.lg" py={20}>
        <Box
          className="yotpo yotpo-main-widget"
          data-product-id={product.id}
          data-price="Product Price"
          data-currency="Price Currency"
          data-name={product.title}
          data-url="The url of your product page"
          data-image-url="The product image url"
        ></Box>
      </Container>
    </>
  );
};

export default Product;

export async function getStaticPaths() {
  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_SHOPIFY_URL!, {
    headers: {
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
    },
  });

  const query = gql`
    {
      products(first: 200) {
        edges {
          node {
            id
            title
            handle
            descriptionHtml
            tags
            variants(first: 100) {
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
            images(first: 10) {
              edges {
                node {
                  src
                }
              }
            }
            priceRange {
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
    paths: res.products.edges.map((edge: any) => ({
      params: { handle: edge.node.handle },
    })),
    fallback: true,
  };
}

export const  getStaticProps: GetStaticProps = async (context) => {
  const handle = context.params?.handle;

  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_SHOPIFY_URL!, {
    headers: {
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
    },
  });

  //7587711615222

  // Shopify Request
  const query = gql`{
    product(handle: "${handle}") {
      id
      title
      descriptionHtml
      tags
      variants(first: 100) {
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
      images(first: 10) {
        edges {
          node {
            src
          }
        }
      }
      priceRange {
        maxVariantPrice {
          amount
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
      handle: handle,
      product: res.product,
    },
    revalidate: 60,
  };
}
