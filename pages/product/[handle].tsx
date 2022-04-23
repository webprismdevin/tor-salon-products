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
import CartContext from "../../lib/CartContext";
import formatter from "../../lib/formatter";
import { GetStaticProps } from "next";
import Product from "../../components/Product";
import Script from "next/script";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { wrap } from "@popmotion/popcorn";

const MotionImage = motion<ImageProps>(Image);

declare interface VariantType {
  id: string;
  priceV2: {
    amount: string;
  };
  title: string;
  availableForSale: boolean;
}

const ProductPage = ({
  handle,
  product,
  collection,
}: {
  handle: string;
  product: any;
  collection: any;
}) => {
  const [itemQty, setItemQty] = useState(1);
  const { cart, setCart } = useContext(CartContext);
  const [yjsLoaded, setLoaded] = useState(false);
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
      onChange: (valueAsString: string, valueAsNumber: number) =>
        setItemQty(valueAsNumber),
    });

  useEffect(() => {
    console.log(Buffer.from(product.id).toString("base64"));
  }, []);

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
        qty: itemQty,
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
      <Script
        id="yotpo reviews"
        src="/yotpo.js"
        onLoad={() => {
          setLoaded(true);
        }}
      />
      <Head>
        <title>{product.title} | TOR Salon Products</title>
        <meta
          name="description"
          content={`${product.description.substring(0, 200)}...`}
        />
      </Head>
      <Flex flexDirection={["column", "row"]}>
        <PhotoCarousel images={product.images.edges} />
        <Container centerContent pt={40} pb={20}>
          <Stack direction={["column"]} spacing={4} w="full" align="flex-start">
            <Heading maxW={500}>{product.title}</Heading>
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
                    Select A Size
                  </Heading>
                  <Select
                    minW={"200px"}
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
              <HStack w="140px">
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
      <Box bg={collection.color?.value ? collection.color.value : "white"}>
        <Flex flexDir={["column-reverse", "row"]}>
          <Box w={["full", "50%"]} px={[8, 20]} py={40} pos="relative">
            <Image
              src={collection.typeImage?.reference.image.url}
              alt=""
              pos="absolute"
              top={0}
              opacity={0.1}
              w="100%"
              left={0}
              zIndex={0}
            />
            <Stack direction={["column"]} spacing={6} pos="relative" zIndex={1}>
              <Heading>{collection.title}</Heading>
              <Text>{collection.description}</Text>
              <Stack
                direction={"row"}
                textAlign="left"
                justify="flex-start"
                spacing={6}
              >
                <Box w="120px">
                  <Image
                    mb={2}
                    src={collection?.benefitOneIcon?.reference.image?.url}
                    alt={collection?.benefitOneText?.value}
                  />
                  <Text>{collection?.benefitOneText?.value}</Text>
                </Box>
                <Box w="120px">
                  <Image
                    mb={2}
                    src={collection?.benefitTwoIcon?.reference.image.url}
                    alt={collection?.benefitTwoText?.value}
                  />
                  <Text>{collection?.benefitTwoText?.value}</Text>
                </Box>
                <Box w="120px">
                  <Image
                    mb={2}
                    src={collection?.benefitThreeIcon?.reference.image.url}
                    alt={collection?.benefitThreeText?.value}
                  />
                  <Text>{collection?.benefitThreeText?.value}</Text>
                </Box>
              </Stack>
            </Stack>
          </Box>
          <AspectRatio ratio={1 / 1} w={["full", "50%"]}>
            <Image src={collection?.image?.url} alt="" />
          </AspectRatio>
        </Flex>
        <Container maxW="container.xl" centerContent py={20}>
          <Heading size="md" mb={20} textTransform="uppercase">
            Other items in this line
          </Heading>
          <SimpleGrid templateColumns={"repeat(3, 1fr)"} w="full" gap={12}>
            {collection.products.edges.map((p: any) => (
              <React.Fragment key={p.node.id}>
                <Product product={p} fontSize={24} />
              </React.Fragment>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      <Container maxW="container.xl" pt={20} pb={40} centerContent>
        {yjsLoaded && (
          <div
            className="yotpo yotpo-main-widget"
            data-product-id={Buffer.from(product.id).toString("base64")}
            data-price={activeVariant.priceV2.amount}
            data-currency={"USD"}
            data-name={product.title}
            data-url={`https://torsalonproducts.com/product/${product.handle}`}
            data-image-url={product.images.edges[0]?.node.url}
          ></div>
        )}
      </Container>
    </>
  );
};

function PhotoCarousel({ images }: any) {
  const controls = useAnimation();

  const [[page, direction], setPage] = useState([0, 0]);

  const index = wrap(0, images.length, page);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <Box pos="relative" maxW={["100%", "50%"]} minW={["100%", "50%"]}>
      <AnimatePresence exitBeforeEnter>
        <AspectRatio ratio={1}>
          <MotionImage
            key={images[index].node.url}
            src={images[index].node.url}
            alt={``}
            objectFit="cover"
            objectPosition="top center"
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          />
        </AspectRatio>
      </AnimatePresence>
      <Box pos="absolute" left={10} top={"50%"} onClick={() => paginate(-1)}>
        ←
      </Box>
      <Box pos="absolute" right={10} top={"50%"} onClick={() => paginate(1)}>
        →
      </Box>
    </Box>
  );
}

export default ProductPage;

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
      collections(first: 5) {
        edges {
          node {
            handle
            title
            description
            descriptionHtml
            image {
              url
            }
            products(first: 3) {
              edges {
                node {
                  handle
                  title
                  priceRange {
                    minVariantPrice {
                      amount
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                      }
                    }
                  }
                }
              }
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
            benefitOneIcon: metafield(namespace: "collection", key: "benefit_1_icon") {
              reference {
                __typename
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
            benefitOneText: metafield(namespace: "collection", key: "benefit_1_text") {
              value
            }
            benefitTwoIcon: metafield(namespace: "collection", key: "benefit_2_icon") {
              reference {
                __typename
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
            benefitTwoText: metafield(namespace: "collection", key: "benefit_2_text") {
              value
            }
            benefitThreeIcon: metafield(namespace: "collection", key: "benefit_3_icon") {
              reference {
                __typename
                ... on MediaImage {
                  image {
                    url
                  }
                }
              }
            }
            benefitThreeText: metafield(namespace: "collection", key: "benefit_3_text") {
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
  }`;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve product. Please check logs");
  }

  console.log(res.product.collections.edges);

  return {
    props: {
      handle: handle,
      product: res.product,
      collection:
        res.product.collections.edges[0].node.handle === "home"
          ? res.product.collections.edges[1].node
          : res.product.collections.edges[0].node,
    },
    revalidate: 60,
  };
};
