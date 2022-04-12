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
  Icon,
  useNumberInput,
  HStack,
  Input,
} from "@chakra-ui/react";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import { useState, useContext, useEffect } from "react";
import CartContext from "../../lib/CartContext";
import formatter from "../../lib/formatter";
import { GetStaticProps } from "next";
import Script from "next/script";

declare interface VariantType {
  id: string;
  priceV2: {
    amount: string;
  };
  title: string;
  availableForSale: boolean;
}

const Product = ({ handle, product }: { handle: string; product: any }) => {
  const [ itemQty, setItemQty ] = useState(1)
  const { cart, setCart } = useContext(CartContext);
  const [activeVariant, setActiveVariant] = useState<VariantType>(() => {
    if (!product) return null;

    return product.variants.edges[0].node;
  });

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: itemQty,
      min: 1,
      precision: 0,
      onChange: (valueAsString: string, valueAsNumber: number) => setItemQty(valueAsNumber)
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  const variants = product?.variants.edges;

  async function addToCart() {
    const response = await fetch("/api/addtocart", {
      method: "POST",
      body: JSON.stringify({
        variantId: activeVariant.id,
        cartId: cart.id,
        qty: itemQty
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
      <Flex flexDirection={["column", "row"]}>
        <AspectRatio ratio={1} maxW={["100%", "50%"]} minW={["100%", "50%"]}>
          <Image
            src={product.images.edges[0].node.url}
            alt={``}
            objectFit="cover"
            objectPosition="top center"
          />
        </AspectRatio>
        <Container centerContent pt={40} pb={20}>
          <Stack direction={["column"]} spacing={4} w="full" align="flex-start">
            <Heading>{product.title}</Heading>
            <Text
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
            />
            <Stack direction={"row"} align="flex-end">
              {variants.length > 1 && (
                <Stack>
                  <Heading as="h4" size="md" mb={3} ml={2}>
                    Select A Size
                  </Heading>
                  <Select
                    minW={"220px"}
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
              <HStack maxW="150px">
                <Button {...inc}>+</Button>
                <Input {...input} textAlign="center" />
                <Button {...dec}>-</Button>
              </HStack>
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
      <Flex flexDir={"row"}>
        <Stack
          direction={["column"]}
          gap={12}
          w="50%"
          px={20}
          py={40}
          bg={
            product.collections.edges[0]?.node.color?.value
              ? product.collections.edges[0]?.node.color?.value
              : "white"
          }
          pos="relative"
        >
          <Image
            src={
              product.collections.edges[0]?.node.typeImage.reference.image?.url
            }
            alt=""
            pos="absolute"
            top={0}
            opacity={0.1}
            w="100%"
            left={0}
          />
          <Heading>{product.collections.edges[0]?.node.title}</Heading>
          <Text>{product.collections.edges[0]?.node.description}</Text>
          <Stack direction={"row"} textAlign="center" spacing={6}>
            <Box>
              <Icon />
              <Text>Benefit 1</Text>
            </Box>
            <Box>
              <Icon />
              <Text>Benefit 2</Text>
            </Box>
            <Box>
              <Icon />
              <Text>Benefit 3</Text>
            </Box>
          </Stack>
        </Stack>
        <AspectRatio ratio={1 / 1} w="50%">
          <Image src={product.collections.edges[0]?.node.image?.url} alt="" />
        </AspectRatio>
      </Flex>
      <Container maxW="container.xl" py={20}>
        <div
          className="embedsocial-product-reviews"
          data-shop="tor-salon-products.myshopify.com"
          data-product={Buffer.from(product.id).toString("base64")}
          data-handle={handle}
        />
        <Script
          id="embed-social-script"
          dangerouslySetInnerHTML={{
            __html: `(function(d, s, id){var js; if (d.getElementById(id)) {return;} js = d.createElement(s); js.id = id; js.src = "https://embedsocial.com/cdn/ri_shopify.js?v=1.0.1"; d.getElementsByTagName("head")[0].appendChild(js);}(document, "script", "EmbedSocialShopifyReviewsScript"));`,
          }}
        />
      </Container>
    </>
  );
};

export default Product;

export async function getStaticPaths() {
  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
      },
    }
  );

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
            images(first: 10) {
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
    product(handle: "${handle}") {
      id
      title
      descriptionHtml
      description
      tags
      collections(first: 1) {
        edges {
          node {
            handle
            title
            description
            image {
              url
            }
            typeImage: metafield(namespace: "collection", key: "typeImage") {
              reference {
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
            color: metafield(namespace: "collection", key: "color") {
              value
            }
          }
        }
      }
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
      images(first: 10) {
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
};
