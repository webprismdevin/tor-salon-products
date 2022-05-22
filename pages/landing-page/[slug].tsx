import { GetStaticProps } from "next";
import {
  Container,
  Box,
  Heading,
  AspectRatio,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Link,
  Stack,
  Button,
  Select,
  Divider,
  chakra,
  Flex,
} from "@chakra-ui/react";
import Head from "next/head";
import { useContext, useEffect, useRef, useState } from "react";
import { gql, GraphQLClient } from "graphql-request";
import CartContext from "../../lib/CartContext";
import graphClient from "../../lib/graph-client";
import { RatingStar } from "rating-star";
import Cart from "../../components/Cart";
import NextLink from "next/link";
import { imageBuilder } from "../../lib/sanity";
import { PortableText } from "@portabletext/react";

// to finish - add features section, consider readding FAQ, add review above the fold, add main image, add founders note

const LandingPage = ({ landingPage, product }: any) => {
  const ctaSection = useRef<HTMLDivElement | null>(null);

  return (
    <chakra.article pb={20}>
      <Head>
        <title>{landingPage.name}</title>
      </Head>
      <Flex p={4} bg="black" align="center" justify="flex-end">
        <NextLink href="/">
          <Heading
            w="full"
            size={"2xl"}
            textAlign={"center"}
            fontFamily={"Futura"}
            color="white"
          >
            TOR
          </Heading>
        </NextLink>
        <Cart color="white" />
      </Flex>
      <Container pt={40} pb={20} maxW="container.xl">
        <Stack direction={["column", "row"]} spacing={40}>
          <Stack
            align="flex-start"
            maxW={["inherit", "600"]}
            spacing={4}
            flexShrink={0}
          >
            <Heading size="3xl">{landingPage.heading}</Heading>
            <Text>{landingPage.subheading}</Text>
            <Button
              onClick={() =>
                ctaSection.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }
            >
              {landingPage.buttonOne}
            </Button>
            <Text fontSize="xs">{landingPage.buttonSubtext}</Text>
            <Box pt={20}>
              <Stack
                spacing={4}
                align="flex-start"
                shadow={"md"}
                p={4}
                borderRadius={10}
                border="1px solid rgba(0, 0, 0, 0.05)"
              >
                <RatingStar
                  id={landingPage.reviews[0]._id}
                  rating={landingPage.reviews[0].rating}
                />
                <Text>{landingPage.reviews[0].review}</Text>
                <Text>
                  <em>- {landingPage.reviews[0].name}</em>
                </Text>
              </Stack>
            </Box>
          </Stack>
          <Box flexShrink={1}>
            <Image
              src={imageBuilder(landingPage.mainImage).url()!}
              alt={landingPage.mainImage?.alt}
            />
          </Box>
        </Stack>
      </Container>
      {landingPage.sections.map((section: SectionProps) => (
        <PageSection key={section._id} section={section} />
      ))}
      <Container maxW="container.lg">
        <Stack direction={["column", "row"]} spacing={6}>
          {landingPage.reviews.map((r: any, i: number) => {
            if (i > 0)
              return (
                <Stack
                  spacing={4}
                  align="flex-start"
                  shadow={"md"}
                  p={4}
                  borderRadius={10}
                  border="1px solid rgba(0, 0, 0, 0.05)"
                  w={["full", "33%"]}
                  key={r._id}
                >
                  <RatingStar id={r._id} rating={r.rating} />
                  <Text>{r.review}</Text>
                  <Text>
                    <em>- {r.name}</em>
                  </Text>
                </Stack>
              );
          })}
        </Stack>
      </Container>
      <Container py={20}>
        <FaqAccordion faqs={landingPage.faqs} />
      </Container>
      <Container ref={ctaSection} py={10} maxW="container.sm" centerContent>
        <Stack spacing={4} textAlign="center">
          <Text fontSize="xs">{landingPage.ctaSupertext}</Text>
          <Heading>{landingPage.cta}</Heading>
          <Text fontSize="xs">{landingPage.ctaSubtext}</Text>
          <Divider />
          <ProductSection product={product} landingPage={landingPage} />
        </Stack>
      </Container>
    </chakra.article>
  );
};

declare interface SectionProps {
    _id: string;
    body: any;
    heading: string;
    layout: "row" | "row-reverse" | "column";
    image: any;
    subheading: string;
}

function PageSection({section}:{ section: SectionProps}) {
    console.log(section)

  return (
    <Container maxW="container.lg" py={20}>
      <Stack direction={["column", section.layout]} spacing={10}>
        <AspectRatio ratio={1 / 1} flexShrink={0} minW={["full", "400"]}>
          <Image
            src={imageBuilder(section.image).width(400).url() as string}
            alt=""
          />
        </AspectRatio>
        <Stack>
          <Heading as="h2">{section.heading}</Heading>
          {section.subheading && <Heading>{section.subheading}</Heading>}
          <Stack maxW="500" spacing={4}>
            <PortableText value={section.body} />
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
}

function FaqAccordion({ faqs }: any) {
  return (
    <Accordion allowMultiple allowToggle minW="50%">
      {faqs.map((faq: any) => (
        <AccordionItem key={faq._id}>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                {faq.question}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel py={4}>
            <Text>{faq.answer}</Text>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function ProductSection({ product, landingPage }: any) {
  const { cart, setCart } = useContext(CartContext);

  const [variant, setVariant] = useState(() => {
    if (product.variants) return product.variants.edges[0].node.id;

    return null;
  });

  async function addToCart() {
    const response = await fetch("/api/addtocart", {
      method: "POST",
      body: JSON.stringify({
        variantId: variant,
        cartId: cart.id,
        qty: 1,
      }),
    }).then((res) => res.json());

    setCart({
      ...cart,
      status: "dirty",
      lines: response.response.cartLinesAdd.cart.lines,
    });

    handleCheckout();
  }

  async function handleCheckout() {
    window.dataLayer.push({
      event: "begin_checkout",
      eventCallback: () => (window.location.href = cart.checkoutUrl),
      eventTimeout: 1200,
    });
  }

  async function applyDiscount() {
    const query = gql`
      mutation cartDiscountCodesUpdate(
        $cartId: ID!
        $discountCodes: [String!]!
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
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  discountAllocations {
                    discountedAmount {
                      amount
                    }
                  }
                  merchandise {
                    ... on ProductVariant {
                      product {
                        title
                      }
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    console.log(cart.id);

    const response = await graphClient.request(query, {
      cartId: cart.id,
      discountCodes: [landingPage.discountCode],
    });

    if (response.errors) {
      console.log(JSON.stringify(response.errors, null, 2));
      //   throw Error("There was a problem creating the cart. Please check logs");
    }
  }

  const initiateCheckOut = async () => {
    addToCart();
  };

  useEffect(() => {
    if (cart.id !== null) applyDiscount();
  }, [cart.id]);

  return (
    <Stack spacing={4} align="center" minW={["full", "400"]}>
      {product.variants?.edges.length > 1 && (
        <>
          <Text fontSize="2xl">{landingPage.variantPrompt}</Text>
          <Select onChange={(e) => setVariant(e.target.value)}>
            {product.variants.edges.map((v: any) => (
              <option key={v.node.id} value={v.node.id}>
                {v.node.title}
              </option>
            ))}
          </Select>
        </>
      )}
      <Button onClick={initiateCheckOut}>Checkout</Button>
    </Stack>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageSlug = params?.slug;
  const query = encodeURIComponent(
    `*[ _type == "landing" && slug.current == "${pageSlug}"]{..., reviews[]->, sections[]->, faqs[]->}`
  );

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());
  const landingPage = result.result[0];

  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
      },
    }
  );

  // Shopify Request
  const productQuery = gql`{
    product(handle: "${landingPage.product}") {
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
            image {
                url
            }
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
      priceRange {
        maxVariantPrice {
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

  const res = await graphQLClient.request(productQuery);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve product. Please check logs");
  }

  return {
    props: {
      landingPage,
      product: res.product,
    },
    revalidate: 60,
  };
};

export async function getStaticPaths() {
  const query = encodeURIComponent(`*[ _type == "landing"] { slug }`);

  const url = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/data/query/production?query=${query}`;
  const result = await fetch(url).then((res) => res.json());
  const landingPages = result.result;

  return {
    paths:
      landingPages?.map((post: any) => ({
        params: {
          slug: post.slug.current,
        },
      })) || [],
    fallback: false,
  };
}

export default LandingPage;
