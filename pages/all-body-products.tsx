import { Stack, Flex, Heading, Text, Box, Container, SimpleGrid, Divider } from "@chakra-ui/react";
import Product from "../components/Product/Product";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";

const BodyCatalog = ({ products }: any) => {
  //to do - add filters

  return (
    <>
      <Head>
        <title>All Body Products | TOR Salon Products</title>
        <meta name="description" content="" />
      </Head>
      <Container maxW="container.xl" py={40}>
        <Heading mb={6} size="2xl" textAlign="center">All Body Products</Heading>
        <Divider />
        <SimpleGrid templateColumns={"repeat(3, 1fr)"} w="full" gap={12} mt={8}>
          {products.map((p: any) => (
            <Product product={p} key={p.node.id} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default BodyCatalog;

export async function getStaticProps() {
  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
      },
    }
  );

  // Shopify Request
  const query = gql`
    {
      products(
        first: 200, query: "product_type:'Goats Milk Soap' OR product_type:'Lip Balms'"
      ) {
        edges {
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

  const res = await graphQLClient.request(query) as any;

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  return {
    props: {
      products: res.products.edges,
    },
    revalidate: 60,
  };
}
