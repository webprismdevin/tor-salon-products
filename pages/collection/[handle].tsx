import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import {
  Container,
  Heading,
  Text,
  Box,
  Stack,
  Flex,
} from "@chakra-ui/react";
import Product from "../../components/Product";
import getCollections from "../../lib/get-collections";

export default function CollectionPage({ handle, data }: { handle: string, data: any}) {

  if(!data) return null

  return (
    <Container py={40} maxW="container.lg">
      <Head>
        <title>{data.title}</title>
      </Head>
      <Stack direction={["column"]} gap={12}>
        <Heading>{data.title}</Heading>
        <Text>{data.description}</Text>
        <Flex w="full" gap={8}>
          {data.products.edges.map((p: any) => (
            <Product key={p.node.id} product={p} />
          ))}
        </Flex>
      </Stack>
    </Container>
  );
}

export async function getStaticPaths() {
  const result = await getCollections();

  return {
    paths: result.collections.edges.map((edge: any) => ({
      params: { handle: edge.node.handle },
    })),
    fallback: true,
  };
}

export async function getStaticProps(context: any) {
  const handle = context.params.handle;

  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_SHOPIFY_URL!, {
    headers: {
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
    },
  });

  // Shopify Request
  const query = gql`{
        collection(handle: "${handle}"){
        title
        description
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
                            altText
                            transformedSrc
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
