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
  Divider,
  GridItem,
} from "@chakra-ui/react";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  Suspense,
} from "react";
import CartContext from "../../lib/CartContext";
import formatter from "../../lib/formatter";
import { GetStaticProps } from "next";
import Product from "../../components/Product/Product";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import NextLink from "next/link";
import { RatingStar } from "rating-star";
import ReviewSubmit from "../../components/Product/ReviewSubmit";
import addToCart from "../../lib/Cart/addToCart";
import SubscriptionPlan from "../../components/Product/SubscriptionPlan";
// import Swatches from '../../components/Product/Swatches';

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

  //subscription plans
  const [subscriptionPlan, setSubscriptionPlan] = useState("");

  //refs
  const reviewsSection = useRef<HTMLDivElement | null>(null);

  //quantity handling
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
  //end quantity handling

  const variants = product?.variants.edges;

  async function handleAddToCart() {
    const response = await addToCart(cart.id, activeVariant.id, itemQty, subscriptionPlan);

    setCart({
      ...cart,
      status: "dirty",
      lines: response.cartLinesAdd.cart.lines,
    });
  }

  function handleActiveVariantChange(id: string) {
    const cv = variants.filter((v: any) => v.node.id === id);
    setActiveVariant(cv[0].node);
  }

  useEffect(() => {
    if (window.dataLayer) {
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push({
        event: "view_item",
        ecommerce: {
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              affiliation: "Storefront",
              item_brand: "TOR",
              value: activeVariant.priceV2.amount,
              item_variant: activeVariant.title,
              currency: "USD",
              item_category: product.productType,
            },
          ],
        },
      });
    }
  }, [activeVariant]);

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
      <SimpleGrid templateColumns={"repeat(2, 1fr)"}>
        <GridItem colSpan={[2, 1]}>
          <PhotoCarousel images={product.images.edges} />
        </GridItem>
        <GridItem colSpan={[2, 1]}>
          <Stack
            py={[4, 20]}
            pl={[4, null, 4, 0]}
            pr={[4, null, 10, 20]}
            spacing={6}
          >
            <Stack direction={"row"} justify={"space-between"}>
              <Heading maxW={[480]}>{product.title}</Heading>
            <Stack>
              {subscriptionPlan === "" ? <Heading fontWeight={600}>
                  {formatter.format(parseInt(activeVariant.priceV2.amount))}
                </Heading> : <Heading fontWeight={600}>
                  <span style={{textDecoration: 'line-through', opacity: 0.6}}>{formatter.format(parseInt(activeVariant.priceV2.amount))}</span> <span style={{fontWeight: 400}}>{formatter.format(parseInt(activeVariant.priceV2.amount)*.95)}</span>
                </Heading>}
                {subscriptionPlan !== "" && <Text textAlign={"right"} color="red">Save 5% on every order!</Text>}
            </Stack>
            </Stack>
            <Divider />
            <HStack justify={"space-around"}>
              <Stack
                direction={["column", null, "column", "row"]}
                align="center"
                justify={"center"}
                w={["100%", "50%"]}
                cursor="pointer"
                onClick={() =>
                  reviewsSection.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
                flexShrink={1}
              >
                <RatingStar
                  id={product.id.split("/")[4]}
                  rating={reviews.bottomline.average_score}
                />
                <Text>
                  {reviews.bottomline.total_review} Review
                  {reviews.bottomline.totalReviews === 1 ? "s" : ""}
                </Text>
              </Stack>
              <Divider orientation="vertical" height={"60px"} px={[2, 0]} />
              <Box w={["100%", "50%"]}>
                <ReviewSubmit handle={product.title} gid={product.id}  />
              </Box>
            </HStack>
            <Divider />
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
            {/* {variants.length > 1 && (
              <Swatches variants={variants} />
            )} */}
            <HStack
              border={"1px solid black"}
              alignSelf={["flex-end", "flex-start"]}
              borderRadius={6}
            >
              <Button fontSize="2xl" variant="ghost" {...dec}>
                -
              </Button>
              <Input w="50px" {...input} variant="ghost" textAlign="center" />
              <Button fontSize="2xl" variant="ghost" {...inc}>
                +
              </Button>
            </HStack>
            {/* subscriptions */}
            {product.sellingPlanGroups.edges.length > 0 && (
              <SubscriptionPlan
              subscriptionPlan={subscriptionPlan}
              setSubscriptionPlan={setSubscriptionPlan}
                sellingPlan={
                  product.sellingPlanGroups.edges[0].node.sellingPlans
                }
              />
            )}
            {/* end subscriptions */}
            <Button
              position={["fixed", "static"]}
              bottom={[7, 0]}
              right={[4, 0]}
              zIndex={[2, 0]}
              w={["70%", "full"]}
              onClick={handleAddToCart}
              isDisabled={!activeVariant?.availableForSale}
              size="lg"
            >
              {activeVariant?.availableForSale ? "Add To Cart" : "Sold Out!"}
            </Button>
            <Box
              className="product_description_html_outer_container"
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
                      className=""
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
                        Ingredients
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
                  your first few washes, or you don&apos;t find our products
                  work for you, we&apos;ll buy it back. No hassles. Just pay
                  return shipping and we&apos;ll refund your purchase.
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
                      Orders placed after 12pm (Mountain Time) Monday -
                      Thursday, will ship the following morning. Orders placed
                      after 11pm (Mountain Time) on Friday will ship the
                      following Monday.
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
        </GridItem>
      </SimpleGrid>
      {collection && (
        <Box bg={collection.color?.value ? collection.color.value : "white"}>
          <Flex flexDir={["column-reverse", "row"]}>
            <Box
              w={["full", "50%"]}
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
            <AspectRatio ratio={1 / 1} w={["full", "50%"]}>
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
    <Box
      pos="sticky"
      top={20}
      maxW={["100%"]}
      minW={["100%"]}
      maxH={["400px", "100%"]}
    >
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
            bottom={[4, "50%"]}
            onClick={() => paginate(-1)}
          >
            ←
          </Box>
          <Box
            pos="absolute"
            right={10}
            bottom={[4, "50%"]}
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
      productType
      sellingPlanGroups(first: 100) {
        edges {
          node {
              sellingPlans(first: 10) {
                  edges {
                      node {
                          id
                          name
                          options {
                              name
                              value
                          }
                      }
                  }
              }
            appName
            name
          }
        }
      }
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
