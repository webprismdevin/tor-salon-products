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
        <title>{data.title}</title>
      </Head>
      <Flex flexDir={"row"}>
        <Stack
          direction={["column"]}
          gap={12}
          w="50%"
          px={20}
          py={40}
          bg={data.color?.value ? data.color.value : "white"}
          pos="relative"
        >
          <Image
            src={data.typeImage.reference.image.url}
            alt=""
            pos="absolute"
            top={0}
            opacity={0.1}
            w="100%"
            left={0}
          />
          <Heading>{data.title}</Heading>
          <Text>{data.description}</Text>
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
          <Image src={data.image.url} alt="" />
        </AspectRatio>
      </Flex>
      {data.collectionFeature && (
        <ProductFeature reference={data.collectionFeature.reference} />
      )}
      <Container maxW="container.xl" pt={10} pb={20}>
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
    // paths: result.collections.edges.map((edge: any) => ({
    //   params: { handle: edge.node.handle },
    // })),
    paths: [
      { params: { handle: "fine-thin" } },
      { params: { handle: "medium-thick" } },
      { params: { handle: "curly" } }
    ],
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

  // Shopify Request
  const query = gql`{
        collection(handle: "${handle}"){
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
        color: metafield(namespace:"collection", key:"color"){
          value
        }
        collectionFeature: metafield(namespace: "collection", key: "feature") {
          reference {
            ... on Product {
              id
              title
              description
              handle
              variants(first: 1) {
                edges {
                  node {
                    id
                    priceV2{
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
              }
              compareAtPriceRange {
                maxVariantPrice {
                  amount
                }
              }
            }
          }
        }
        products(first: 100) {
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

  return {
    props: {
      handle: handle,
      data: res.collection,
    },
    revalidate: 60,
  };
}
