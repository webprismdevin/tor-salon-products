import {
  Heading,
  Box,
  Container,
  Stack,
  Text,
  AspectRatio,
  Image,
  ImageProps,
  Select,
  HStack,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  GridItem,
  useNumberInput,
} from "@chakra-ui/react";
import { Button as Button2 } from "../../components/Button";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import React, { useState, useRef, useContext } from "react";
import formatter from "../../lib/formatter";
import { GetStaticProps } from "next";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import { RatingStar } from "rating-star";
import SubscriptionPlan from "../../components/Product/SubscriptionPlan";
import useAddToCart from "../../lib/useAddToCart";
import {
  AnalyticsPageType,
  sendShopifyAnalytics,
  AnalyticsEventName,
  getClientBrowserParameters,
  type ShopifyAddToCartPayload,
  ShopifyAnalyticsProduct,
  ShopifyAnalyticsPayload,
} from "@shopify/hydrogen-react";
import { CartContext } from "../../app/cart-provider";
import groq from "groq";
import { MODULE_FRAGMENT, sanity } from "../../lib/sanity";
import Modules from "../../components/Modules/Modules";
import extractGID from "../../lib/extract-gid";
import Script from "next/script";

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
  defaultModules,
  modules,
  handle,
  product,
  reviews,
  analytics,
}: {
  handle: string;
  product: any;
  collection: any;
  collections: any;
  reviews: any;
  modules: [any] | null;
  defaultModules: [any] | null;
  analytics: ShopifyAnalyticsPayload;
}) => {
  const [itemQty, setItemQty] = useState(1);
  const { addItemToCart } = useAddToCart();
  const { cart } = useContext(CartContext);
  const [activeVariant, setActiveVariant] = useState<VariantType>(() => {
    if (!product) return null;

    const variant = product.variants.edges.find(
      (edge: any) => edge.node.availableForSale === true
    )?.node;

    return variant ?? null;
  });

  const pageModules = modules ? modules : defaultModules;

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
    if (analytics.products) {
      const payload: ShopifyAddToCartPayload = {
        ...getClientBrowserParameters(),
        ...analytics,
        cartId: cart?.id,
        products: [
          {
            ...analytics.products[0],
            quantity: 1,
          },
        ],
      };

      sendShopifyAnalytics({
        eventName: AnalyticsEventName.ADD_TO_CART,
        payload,
      });

      console.log("pageview sent");
    }

    addItemToCart(activeVariant.id, itemQty, subscriptionPlan);
  }

  function handleActiveVariantChange(id: string) {
    const cv = variants.filter((v: any) => v.node.id === id);
    setActiveVariant(cv[0].node);
  }

  if (!product) return null;

  const seoTitle = `${product.title} | TOR Salon Products`;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta
          name="description"
          content={`${product.description.substring(0, 200)}...`}
        />
        <meta property="og:title" content={product.title} />
        <meta
          property="og:description"
          content={product.description.substring(0, 500)}
        />
        <meta
          property="og:url"
          content={`https://torsalonproducts.com/products/${handle}`}
        />
        <meta property="og:image" content={product.images.edges[0].node.url} />
        <meta property="product:brand" content="TOR Salon Products" />
        <meta property="product:availability" content="in stock" />
        <meta property="product:condition" content="new" />
        <meta
          property="product:price:amount"
          content={activeVariant?.priceV2.amount}
        />
        <meta property="product:price:currency" content="USD" />
        <meta property="product:catalog_id" content="711750850270833" />
        <meta property="product:category" content="486" />
        <meta property="product:retailer_item_id" content={product.id} />
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
              <div>
                <div className="h-6 overflow-hidden">
                <div className="loox-rating" data-fetch data-id={extractGID(product.id)}></div>
                  {/* <RatingStar
                    id={product.id.split("/")[4]}
                    rating={product.avg_rating.value}
                    size={16}
                  />
                  <span className="text-gray-400">
                    [{product.bottomline.total_review}]
                  </span> */}
                </div>
                <Heading maxW={[480]}>{product.title}</Heading>
              </div>
              <Stack>
                {subscriptionPlan === "" ? (
                  <Heading fontWeight={600} size={["lg"]} textAlign="right">
                    {formatter.format(parseInt(activeVariant?.priceV2.amount))}
                  </Heading>
                ) : (
                  <Heading fontWeight={600} size={["lg"]} textAlign="right">
                    <span
                      style={{ textDecoration: "line-through", opacity: 0.6 }}
                    >
                      {formatter.format(
                        parseInt(activeVariant?.priceV2.amount)
                      )}
                    </span>{" "}
                    <span style={{ fontWeight: 400 }}>
                      {formatter.format(
                        parseInt(activeVariant?.priceV2.amount) * 0.95
                      )}
                    </span>
                  </Heading>
                )}
                {subscriptionPlan !== "" && (
                  <Text size={["sm"]} textAlign={"right"} color="red">
                    Save 5%!
                  </Text>
                )}
              </Stack>
            </Stack>
            <Divider />
            {variants.length > 1 && (
              <Select
                minW={"200px"}
                value={activeVariant?.id}
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
            <Button2
              className="fixed w-[70%] md:w-full md:static bottom-7 md:bottom-0 right-4 left-4 md:right-0 z-50 py-3 px-4"
              onClick={handleAddToCart}
              isDisabled={!activeVariant?.availableForSale}
            >
              {activeVariant?.availableForSale ? "Add To Cart" : "Sold Out!"}
            </Button2>
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
      {pageModules && <Modules modules={pageModules} />}
      <div
        className="w-full container mx-auto"
        key={product.id}
        id="looxReviews"
        data-product-id={extractGID(product.id)}
      ></div>
      <Script
        id={product.id}
        strategy="lazyOnload"
        key={product.id}
        src="https://loox.io/widget/loox.js?shop=tor-salon-products.myshopify.com"
      />
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
      minW={[300, "100%"]}
      maxW={[300, "auto"]}
      maxH={[300, "100%"]}
      mx={["auto", 0]}
    >
      <AspectRatio ratio={1}>
        <AnimatePresence mode="wait">
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
            cursor={"pointer"}
            pos="absolute"
            left={10}
            bottom={[4, "50%"]}
            onClick={() => paginate(-1)}
          >
            ←
          </Box>
          <Box
            cursor={"pointer"}
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

function ReviewSection({ reviews }: any) {
  return (
    <div>
      {reviews && reviews.reviews.length > 0 && (
        <Container
          // ref={reviewsSection}
          maxW="container.lg"
          pt={20}
          pb={20}
        >
          <Box w="full" py={0}>
            <Heading>Reviews</Heading>
            <Divider mt={6} />
          </Box>
          {reviews.reviews.map((r: any) => (
            <Stack key={r.id} spacing={2} my={2} bg="gray.50" p={[4, 8]}>
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
    </div>
  );
}

export default ProductPage;

export async function getStaticPaths() {
  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
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

  const res = (await graphQLClient.request(query)) as any;

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
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
      },
    }
  );

  const defaultsQuery = groq`*[_type == 'settings'][0]{
    ${MODULE_FRAGMENT}
  }`;

  const defaults = await sanity.fetch(defaultsQuery);

  const sanityQuery = groq`*[_type == 'product' && store.slug.current == '${handle}'][0]{
    ${MODULE_FRAGMENT}
  }`;

  const modules = await sanity.fetch(sanityQuery, { handle });

  // Shopify Request
  const productQuery = gql`{
    product(handle: "${handle}") {
      vendor
      id
      title
      descriptionHtml
      description
      tags
      productType
      avg_rating: metafield(namespace: "loox", key: "avg_rating") {
        value
      }
      num_reviews: metafield(namespace: "loox", key: "num_reviews") {
        value
      }
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
                  variants(first: 2) {
                    edges {
                      node {
                        id
                      }
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

  const res = (await graphQLClient.request(productQuery)) as any;

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve product. Please check logs");
  }

  // const reviews = await fetch(
  //   `https://api-cdn.yotpo.com/v1/widget/bz5Tc1enx8u57VXYMgErAGV7J82jXdFXoIImJx6l/products/${extractGID(
  //     res.product.id
  //   )}/reviews.json`
  // ).then((res) => res.json());

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: res.product.id,
    variantGid: res.product.variants.edges[0].node.id,
    name: res.product.title,
    variantName: res.product.variants.edges[0].node.title,
    brand: res.product.vendor,
    price: res.product.variants.edges[0].node.priceV2.amount,
  };

  return {
    props: {
      analytics: {
        pageType: AnalyticsPageType.product,
        resourceId: res.product.id,
        products: [productAnalytics],
      },
      defaultModules: defaults.modules,
      modules: modules.modules,
      handle,
      key: handle,
      // reviews: reviews.response,
      product: res.product,
    },
    revalidate: 10,
  };
};
