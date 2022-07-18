import {
  Button,
  Container,
  Divider,
  GridItem,
  Heading,
  Select,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Image,
  Link,
} from "@chakra-ui/react";
import { gql, GraphQLClient } from "graphql-request";
import { groq } from "next-sanity";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import AuthContext from "../lib/auth-context";
import formatter from "../lib/formatter";
import { sanity } from "../lib/sanity";

// add link to instruction video in header
// add other benefits
// add shipping policy for wholesale orders
// add total price (MSRP & wholesale) 
// add link to download retail & wholesale pricing guide PDF ✅

export default function Wholesale({ products, page }: any) {
  const { user, token } = useContext(AuthContext);
  //handle filters
  const [type, setType] = useState("");
  const [filteredProducts, setProducts] = useState(products);

  const typeSet = new Set(
    products.map((product: any) => product.node.productType)
  );

  useEffect(() => {
    if (type === "") setProducts(products);

    if (type !== "")
      setProducts(
        products.filter((prod: any) => prod.node.productType === type)
      );
  }, [type]);

  function createDraftOrder(){
    const customerObject = {
      customerId: user.id
    }

    console.log(customerObject)
  }

  if (!user?.isPro || !user)
    return (
      <Container centerContent>
        {user && !user?.isPro && (
          <Stack spacing={2} textAlign={"center"}>
            <Text>Please login as a Salon Pro for access.</Text>
            <Text>
              If you have already signed up as a Salon Pro,{" "}
              <Link
                onClick={() => window.Tawk_API.maximize()}
                textDecor={"underline"}
              >
                message us
              </Link>
              so we can ensure you have the proper access.
            </Text>
          </Stack>
        )}
        {user && user?.isPro && <Loader />}
      </Container>
    );

  return (
    <Container py={20} maxW="container.xl">
      <Head>
        <title>Order Wholesale | TOR Salon Products</title>
      </Head>
      <Stack py={10} direction={"row"} justify="space-between" w="full">
        <Stack spacing={4}>
          <Heading as="h1" size="2xl">
            Order Wholesale
          </Heading>
          <Text>Free shipping on continental U.S. orders of $250+</Text>
          <Text>
            Need help?{" "}
            <Link
              onClick={() => window.Tawk_API.maximize()}
              textDecor={"underline"}
            >
              Message us
            </Link>{" "}
            for assistance.
          </Text>
        </Stack>
        <Stack align={"flex-end"} spacing={2}>
          <Text fontWeight={"bold"} fontSize="xl">
            Pricing Guides
          </Text>
          <Divider />

          <Link href={`${page.wholesaleGuideUrl}?dl=tor-wholesale-guide.pdf`}>
            Wholesale Pricing Guide (PDF)
          </Link>
          <Link href={`${page.retailGuideUrl}?dl=tor-MSRP-guide.pdf`}>
            MSRP Guide (PDF)
          </Link>
        </Stack>
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
                        <Button onClick={() => console.log(v.node.id)} size="sm">
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
        query: "tag_not:Bundle AND tag_not:gift_card AND tag_not:soap AND tag_not:lip_balm AND NOT product_type:Candles"
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

  const wholesaleQuery = groq`*[_type == "wholesale"]
  {...,
    "retailGuideUrl": retailGuide.asset->url,
    "wholesaleGuideUrl": wholesaleGuide.asset->url,
  }[0]`;

  const page = await sanity.fetch(wholesaleQuery, {});

  return {
    props: {
      products: res.products.edges,
      page,
    },
    revalidate: 60,
  };
}
