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
} from "@chakra-ui/react";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import { useState, useContext } from "react";
import CartContext from "../../lib/CartContext";
import formatter from "../../lib/formatter";
import { GetStaticProps } from "next";
import Script from "next/script";

const Product = ({ handle, product }: { handle: string; product: any }) => {
  const { cart, setCart } = useContext(CartContext);
  const [variantId, setVariantId] = useState(() => {
    if (!product) return null;

    return product.variants.edges[0].node.id;
  });

  const variants = product?.variants.edges;

  async function addToCart() {
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
    const cv = variants.filter((v: any) => v.node.id === id);

    return formatter.format(cv[0].node.priceV2.amount);
  }

  if (!product) return null;

  return (
    <>
      <Head>
        <title>{product.title} | TOR Salon Products</title>
        <meta name="description" content={`${product.description.substring(0, 200)}...`} />
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
                Select A Size
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
            <Button onClick={addToCart} isDisabled={!product.availableForSale}>{product.availableForSale ? "Add To Cart" : "Sold Out!"}</Button>
          </Stack>
        </Container>
      </Flex>
      <Container maxW="container.lg" py={20}>
      <div className="embedsocial-product-reviews" data-shop="tor-salon-products.myshopify.com" data-product={Buffer.from(product.id).toString('base64')} data-handle={handle}></div>
      <Script
        id="embed-social-script"
        dangerouslySetInnerHTML={{
          __html: `(function(d, s, id){var js; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "https://embedsocial.com/cdn/ri_shopify.js?v=1.0.1"; d.getElementsByTagName("head")[0].appendChild(js);}(document, "script", "EmbedSocialShopifyReviewsScript"));`
        }}
      />
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
            description
            tags
            availableForSale
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
      description
      availableForSale
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
