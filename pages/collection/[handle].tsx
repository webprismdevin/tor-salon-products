import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import {
  Container,
  Heading,
  Text,
  Box,
  Stack,
  SimpleGrid,
  GridItem,
  AspectRatio,
  Image,
  Flex,
  Icon,
} from "@chakra-ui/react";
import getCollections from "../../lib/get-collections";
import ProductFeature from "../../components/ProductFeature";
import Product from "../../components/Product";

export default function CollectionPage({
  handle,
  data,
}: {
  handle: string;
  data: any;
}) {
  if (!data) return null;

  return (
    <>
      <Head>
        <title>{data.title} | TOR Salon Products</title>
        <meta name="description" content={`${data.description.substring(0, 200)}...`}
 />
      </Head>
      <Flex
        flexDir={["column-reverse", "row"]}
        bg={data.color?.value ? data.color.value : "white"}
      >
        <Box w={["full", "50%"]} px={[8, 20]} py={[20, 40]} pos="relative">
          <Stack direction={["column"]} spacing={6} pos="relative" zIndex={1}>
            <Heading>{data.title}</Heading>
            <Text 
              maxW={600}
              dangerouslySetInnerHTML={{
              __html: data.descriptionHtml
            }}/>
            <Stack
              direction={"row"}
              textAlign="left"
              justify="flex-start"
              spacing={6}
            >
              <Box w="120px">
                <Image
                  mb={2}
                  src={data.benefitOneIcon?.reference.image?.url}
                  alt={data.benefitOneText?.value}
                />
                <Text>{data.benefitOneText?.value}</Text>
              </Box>
              <Box w="120px">
                <Image
                  mb={2}
                  src={data.benefitTwoIcon?.reference.image?.url}
                  alt={data.benefitTwoText?.value}
                />
                <Text>{data.benefitTwoText?.value}</Text>
              </Box>
              <Box w="120px">
                <Image
                  mb={2}
                  src={data.benefitThreeIcon?.reference.image?.url}
                  alt={data.benefitThreeText?.value}
                />
                <Text>{data.benefitThreeText?.value}</Text>
              </Box>
            </Stack>
          </Stack>
        </Box>
        <AspectRatio ratio={1 / 1} w={["full", "50%"]}>
          <Image src={data.image?.url} alt="" />
        </AspectRatio>
      </Flex>
      {data.collectionFeature && (
        <ProductFeature reference={data.collectionFeature.reference} />
      )}
      <Container maxW="container.xl" py={40}>
        <SimpleGrid templateColumns={"repeat(3, 1fr)"} w="full" gap={12}>
          {data.products.edges.map((p: any) => (
            <Product product={p} key={p.node.id} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  const result = await getCollections("home");

  return {
    paths: result.collections.edges.map((edge: any) => ({
      params: { handle: edge.node.handle },
    })),
    fallback: true,
  };
}

export async function getStaticProps(context: any) {
  const handle = context.params.handle;

  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
      },
    }
  );

  console.log(handle)

  // Shopify Request
  const query = gql`{
        collection(handle: "${handle}"){
        title
        description
        descriptionHtml
        image {
          url
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
        color: metafield(namespace:"collection", key:"color"){
          value
        }
        products(first: 100, sortKey: BEST_SELLING) {
                edges{
                    node {
                      id
                      title
                      description
                      handle
                      variants(first: 1) {
                        edges {
                          node {
                            id
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
    }`;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  console.log(res.collection, " from collection query")

  return {
    props: {
      handle: handle,
      data: res.collection,
    },
    revalidate: 60,
  };
}