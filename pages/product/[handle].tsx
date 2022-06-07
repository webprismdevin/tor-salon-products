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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Divider,
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import React, { useState, useContext, useRef } from "react";
import CartContext from "../../lib/CartContext";
import formatter from "../../lib/formatter";
import { GetStaticProps } from "next";
import Product from "../../components/Product";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import NextLink from "next/link";
import { RatingStar } from "rating-star";
import { AiOutlineInfoCircle } from "react-icons/ai";

const MotionImage = motion<ImageProps>(Image);

declare interface VariantType {
  id: string;
  priceV2: {
    amount: string;
  };
  title: string;
  availableForSale: boolean;
}

const returnCollection = (handle: string) => {
  switch (handle) {
    case "curly":
      return "/type/curly";
    case "medium-thick":
      return "/type/medium-thick";
    case "fine-thin":
      return "/type/fine-thin";
    default:
      return `/collection/${handle}`;
  }
};

const ProductPage = ({
  product,
  collection,
  reviews,
}: {
  handle: string;
  product: any;
  collection: any;
  collections: any;
  reviews: any;
}) => {
  const [itemQty, setItemQty] = useState(1);
  const { cart, setCart } = useContext(CartContext);
  const [activeVariant, setActiveVariant] = useState<VariantType>(() => {
    if (!product) return null;

    return product.variants.edges.find(
      (edge: any) => edge.node.availableForSale === true
    ).node;
  });

  const reviewsSection = useRef<HTMLDivElement | null>(null);

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      defaultValue: itemQty,
      min: 1,
      precision: 0,
      onChange: (valueAsString: string, valueAsNumber: number) =>
        setItemQty(valueAsNumber),
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
      <Head>
        <title>{product.title} | TOR Salon Products</title>
        <meta
          name="description"
          content={`${product.description.substring(0, 200)}...`}
        />
      </Head>
      <Stack
        flexDirection={["column", "row"]}
        alignItems="flex-start"
        spacing={[6, 0]}
      >
        <PhotoCarousel images={product.images.edges} />
        <Stack
          direction={["column"]}
          spacing={6}
          w="full"
          align="flex-start"
          pt={[0, 20]}
          pb={20}
          px={[4, 20]}
        >
          <Heading size="xl" as="h1">
            {product.title}
          </Heading>
          {reviews && reviews.bottomline.totalReviews > 0 && (
            <HStack
              onClick={() =>
                reviewsSection.current?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <RatingStar
                id={product.id.split("/")[4]}
                rating={reviews.bottomline.average_score}
              />
              <Text>
                {reviews.bottomline.total_review} Review
                {reviews.bottomline.totalReviews !== 1 ? "s" : ""}
              </Text>
            </HStack>
          )}
          <Box>
            <Text fontSize={18}>
              {formatter.format(parseInt(activeVariant.priceV2.amount))}
            </Text>
            <HStack justify={"center"}>
              <Text fontSize={"xs"}>Pay in 4 installments. Interest-free.</Text>
              <Tooltip
                label="Purchase now and pay later with Shop Pay Installments. Most approvals are instant, and pay no interest or fees with on-time payments."
                aria-label="A tooltip"
              >
                <span>
                  <Icon as={AiOutlineInfoCircle} />
                </span>
              </Tooltip>
            </HStack>
          </Box>
          <Box
            className="product_description_hmtl_outer_container"
            dangerouslySetInnerHTML={{
              __html: product.descriptionHtml,
            }}
          />
          <Accordion w="full" allowToggle>
            {product.instructions && (
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Use Instructions &amp; Tips
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel p={4}>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: product.instructions.value,
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}
            {product.ingredients && (
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Product Ingredients
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel p={4}>
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: product.ingredients.value,
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>
            )}
          </Accordion>
          <Stack spacing={4}>
            <Stack
              direction={"row"}
              align="flex-end"
              justify={"center"}
              flexShrink={1}
            >
              <>
                {variants.length > 1 && (
                  <Select
                    minW={"200px"}
                    value={activeVariant.id}
                    onChange={(e) => {
                      handleActiveVariantChange(e.target.value);
                    }}
                  >
                    {variants.map((v: { node: VariantType }) => (
                      <option key={v.node.id} value={v.node.id}>
                        Size: {v.node.title}
                      </option>
                    ))}
                  </Select>
                )}
              </>
              <HStack>
                <Button fontSize="2xl" variant="ghost" {...dec}>
                  -
                </Button>
                <Input
                  w="50px"
                  {...input}
                  variant="outline"
                  textAlign="center"
                />
                <Button fontSize="2xl" variant="ghost" {...inc}>
                  +
                </Button>
              </HStack>
            </Stack>

            <Box
              pos={["fixed", "static"]}
              bottom={7}
              zIndex={[2, 0]}
              right={2}
              px={[2, 0]}
              w={["75%", "full"]}
            >
              <Button
                w={["full"]}
                onClick={addToCart}
                isDisabled={!activeVariant?.availableForSale}
                size="lg"
              >
                {activeVariant?.availableForSale ? "Add To Cart" : "Sold Out!"}
              </Button>
            </Box>
          </Stack>
          {!activeVariant?.availableForSale && (
            <Link onClick={() => window.Tawk_API.maximize()}>
              Let me know when this product is back in stock!
            </Link>
          )}
          <HStack w="full" justify={["center", "flex-start"]} spacing={6}>
            <Image
              minW="166"
              maxW="166"
              src={"/images/payment-options/shop_pay_with_affirm_color.png"}
              alt="Shop Pay Installments logo"
            />
            <Image
              minH="42"
              maxH="42"
              src={"/images/payment-options/apple_pay_mark.svg"}
              alt="Apple Pay logo"
            />
            <Image
              minH="42"
              maxH="42"
              src={"/images/payment-options/GPay_Acceptance_Mark_800.png"}
              alt="Apple Pay logo"
            />
          </HStack>
          <Accordion w="full" allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Money-back Guarantee
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel p={4}>
                We believe in our products. If you&apos;re not satisfied with
                your first few washes, or you don&apos;t find our products work
                for you, we&apos;ll buy it back. No hassles. Just pay return
                shipping and we&apos;ll refund your purchase.
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Shipping Policy
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel p={4}>
                <Stack spacing={2}>
                  <Text>
                    We want to get everyone their orders as soon as possible,
                    and make our best effort to do so.
                  </Text>
                  <Text>
                    Orders placed after 12pm (Mountain Time) Monday - Thursday,
                    will ship the following morning. Orders placed after 11pm
                    (Mountain Time) on Friday will ship the following Monday.
                  </Text>
                  <Text>
                    The shipping companies in our town aren&apos;t open past
                    noon on Friday. We appreciate your patience.
                  </Text>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </Stack>
      {collection && (
        <Box bg={collection.color?.value ? collection.color.value : "white"}>
          <Flex flexDir={["column-reverse", "row"]}>
            <Box
              w={["full", "60%"]}
              pl={[8, 20]}
              pr={[8, 40]}
              py={[20, 40]}
              pos="relative"
            >
              <Image
                src={collection.typeImage?.reference.image.url}
                alt=""
                pos="absolute"
                top={[0, 10]}
                opacity={0.1}
                w="70%"
                left={[0, 20]}
                zIndex={0}
              />
              <Stack
                direction={["column"]}
                spacing={6}
                pos="relative"
                zIndex={1}
              >
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
                      boxSize={6}
                      src={collection?.benefitOneIcon?.reference.image?.url}
                      alt={collection?.benefitOneText?.value}
                    />
                    <Text>{collection?.benefitOneText?.value}</Text>
                  </Box>
                  <Box w="120px">
                    <Image
                      mb={2}
                      boxSize={6}
                      src={collection?.benefitTwoIcon?.reference.image.url}
                      alt={collection?.benefitTwoText?.value}
                    />
                    <Text>{collection?.benefitTwoText?.value}</Text>
                  </Box>
                  <Box w="120px">
                    <Image
                      mb={2}
                      boxSize={6}
                      src={collection?.benefitThreeIcon?.reference.image.url}
                      alt={collection?.benefitThreeText?.value}
                    />
                    <Text>{collection?.benefitThreeText?.value}</Text>
                  </Box>
                </Stack>
              </Stack>
            </Box>
            <AspectRatio ratio={1 / 1} w={["full", "40%"]}>
              <Image src={collection?.image?.url} alt="" />
            </AspectRatio>
          </Flex>
          <Container maxW="container.xl" centerContent py={20}>
            <SimpleGrid templateColumns={"repeat(3, 1fr)"} w="full" gap={12}>
              {collection.products.edges.map((p: any, i: number) => (
                <Product product={p} fontSize={24} key={i} />
              ))}
            </SimpleGrid>
            <NextLink
              href={returnCollection(collection.handle) as string}
              passHref
            >
              <Button mt={[8]}>See Collection</Button>
            </NextLink>
          </Container>
        </Box>
      )}
      {reviews && reviews.reviews.length > 0 && (
        <Container
          ref={reviewsSection}
          maxW="container.lg"
          pt={40}
          pb={20}
          centerContent
          key={product.id.split("/")[4]}
        >
          <Box w="full" py={12}>
            <Heading>Reviews</Heading>
            <Divider mt={6} />
          </Box>
          {reviews.reviews.map((r: any) => (
            <Stack key={r.id} spacing={2}>
              <HStack>
                <RatingStar id={r.id.toString()} rating={r.score} />
                <Text>Verified Review</Text>
              </HStack>
              <Text
                fontSize="2xl"
                textTransform={"capitalize"}
                dangerouslySetInnerHTML={{
                  __html: r.title,
                }}
              />
              <Text
                dangerouslySetInnerHTML={{
                  __html: r.content,
                }}
              ></Text>
              <Text fontStyle={"italic"} textTransform="capitalize">
                {r.user.display_name}
              </Text>
            </Stack>
          ))}
        </Container>
      )}
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
    <Box pos="relative" top={0} maxW={["100%", "40%"]} minW={["100%", "40%"]}>
      <AspectRatio ratio={1}>
        <AnimatePresence exitBeforeEnter>
          <MotionImage
            key={images[index].node.url}
            src={images[index].node.url}
            alt={``}
            objectFit="fill"
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
          />
        </AnimatePresence>
      </AspectRatio>
      {images.length > 1 && (
        <>
          <Box
            pos="absolute"
            left={10}
            top={"50%"}
            onClick={() => paginate(-1)}
          >
            ←
          </Box>
          <Box
            pos="absolute"
            right={10}
            top={"50%"}
            onClick={() => paginate(1)}
          >
            →
          </Box>
        </>
      )}
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
      products(first: 200, query: "NOT gift-card") {
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
    paths: res.products.edges.map((edge: any) => ({
      params: { handle: edge.node.handle, key: edge.node.handle },
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
      collectionToPull: metafield(namespace: "product", key:"featured_collection"){
        value
      }
      instructions: metafield(namespace: "product", key: "use_instructions") {
        value
      }
      ingredients: metafield(namespace: "product", key: "ingredients"){
        value
      }
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
  }`;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve product. Please check logs");
  }

  let collectionQuery = gql`{
    collection(handle: "${res.product.collectionToPull?.value}") {
        handle
        title
        description
        descriptionHtml
        image {
          url
        }
        products(first: 3, sortKey: BEST_SELLING) {
          edges {
            node {
              handle
              title
              priceRange {
                minVariantPrice {
                  amount
                }
                maxVariantPrice {
                  amount
                }
              }
              compareAtPriceRange {
                maxVariantPrice {
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
    }`;

  const collectionRes = await graphQLClient.request(collectionQuery);

  if (collectionRes.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve product. Please check logs");
  }

  function handleCollectionFilter() {
    const filteredCollections = res.product.collections.edges.filter(
      (n: any) => n.node.handle !== "home" && n.node.handle !== "homepage-body"
    );

    if (filteredCollections[0]) return filteredCollections[0].node;

    return null;
  }

  const reviews = await fetch(
    `https://api-cdn.yotpo.com/v1/widget/bz5Tc1enx8u57VXYMgErAGV7J82jXdFXoIImJx6l/products/${
      res.product.id.split("/")[4]
    }/reviews.json`
  ).then((res) => res.json());

  return {
    props: {
      key: handle,
      reviews: reviews.response,
      product: res.product,
      collection: collectionRes.collection
        ? collectionRes.collection
        : handleCollectionFilter(),
    },
    revalidate: 10,
  };
};
