import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import {
  Container,
  Heading,
  Text,
  Box,
  Stack,
  SimpleGrid,
  AspectRatio,
  Image,
  Flex,
} from "@chakra-ui/react";
import getCollections from "../../lib/get-collections";
import ProductFeature from "../../components/ProductFeature";
import Product from "../../components/Product/Product";
import { AnalyticsPageType } from "@shopify/hydrogen-react";

export default function CollectionPage({
  handle,
  data,
  analytics
}: {
  handle: string;
  data: any;
  analytics?: any;
}) {
  if (!data) return null;

  return (
    <>
      <Head>
        <title>{`${data.title} | TOR Salon Products`}</title>
        <meta
          name="description"
          content={`${data.description.substring(0, 200)}...`}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "${data.title}",
              "description": "${data.description}"
            }`,
          }}
        />
      </Head>
      <Flex
        flexDir={["column-reverse", "row"]}
        bg={data.color?.value ? data.color.value : "white"}
      >
        <Box w={["full", "50%"]} px={[8, 20]} py={[10, 20]} pos="relative">
          <Stack direction={["column"]} spacing={6} pos="relative" zIndex={1}>
            <Heading as="h1">{data.title}</Heading>
            <Stack direction={"row"} justify="flex-start" spacing={6}>
              <Stack align={"center"} textAlign="center" w="120px">
                <Image
                  mb={2}
                  boxSize={6}
                  src={data.benefitOneIcon?.reference.image?.url}
                  alt={data.benefitOneText?.value}
                />
                <Text>{data.benefitOneText?.value}</Text>
              </Stack>
              <Stack align={"center"} textAlign="center" w="120px">
                <Image
                  mb={2}
                  boxSize={6}
                  src={data.benefitTwoIcon?.reference.image?.url}
                  alt={data.benefitTwoText?.value}
                />
                <Text>{data.benefitTwoText?.value}</Text>
              </Stack>
              <Stack align={"center"} textAlign="center" w="120px">
                <Image
                  mb={2}
                  boxSize={6}
                  src={data.benefitThreeIcon?.reference.image?.url}
                  alt={data.benefitThreeText?.value}
                />
                <Text>{data.benefitThreeText?.value}</Text>
              </Stack>
            </Stack>
            <Box
              maxW={600}
              dangerouslySetInnerHTML={{
                __html: data.descriptionHtml,
              }}
            />
          </Stack>
        </Box>

        <AspectRatio
          ratio={[2 / 1]}
          w={["full", "50%"]}
          maxH={["200px", null, "100%"]}
        >
          <Image src={data.image?.url} alt="" />
        </AspectRatio>
      </Flex>
      {data.collectionFeature && (
        <ProductFeature reference={data.collectionFeature.reference} />
      )}
      <Container maxW="container.xl" pt={10} pb={20}>
        <SimpleGrid
          templateColumns={["repeat(1, 1fr)", null, null, "repeat(3, 1fr)"]}
          w="full"
          gap={12}
        >
          {data.products.edges.map((p: any) => (
            <Product product={p} key={p.node.id} analytics={analytics} />
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
        "X-Shopify-Storefront-Access-Token":
          process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
      },
    }
  );

  console.log(handle);

  // Shopify Request
  const query = gql`{
        collection(handle: "${handle}"){
        id
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
        products(first: 100) {
                edges{
                    node {
                      id
                      title
                      description
                      handle
                      variants(first: 2) {
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
    }`;

  const res:any = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  return {
    props: {
      handle: handle,
      data: res.collection,
      analytics: {
        pageType: AnalyticsPageType.collection,
        resourceId: res.collection.id,
        collectionHandle: handle,
      },
    },
    revalidate: 60,
  };
}
