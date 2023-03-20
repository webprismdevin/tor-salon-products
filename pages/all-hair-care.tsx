import {
  Stack,
  Heading,
  Text,
  Box,
  Container,
  SimpleGrid,
} from "@chakra-ui/react";
import Product from "../components/Product/Product";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";

const HairCatalog = ({ products }: any) => {
  //to do - add filters

  return (
    <>
      <Head>
        <title>All Hair Products | TOR Salon Products</title>
        <meta name="description" content="" />
      </Head>
      <Box w="full" bgImage="/images/all-hair-care-bg.jpg" bgPos={"center"} bgSize={"cover"} bgAttachment={["scroll", "fixed"]}>
          <Container py={40} maxW="container.xl">
            <Stack w={["full", "50%"]} color="black" bgColor={"whiteAlpha.900"} p={[10]} borderRadius={5}>
              <Heading size="2xl">Shop All Hair Care</Heading>
              <Text>TOR products are formulated specifically by hair type, to tackle their unique needs - not for mass appeal. Made in the USA.</Text>
            </Stack>
          </Container>
      </Box>
      <Container maxW="container.xl" py={20}>
        <SimpleGrid templateColumns={"repeat(3, 1fr)"} w="full" gap={12}>
          {products.map((p: any) => (
            <Product product={p} key={p.node.id} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default HairCatalog;

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
        first: 200,
        query: "product_type:Bundle OR product_type:Co-wash OR product_type:Conditioners OR product_type:Shampoo OR product_type:Styling Products",
        sortKey: PRODUCT_TYPE
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

  const res = await graphQLClient.request(query);

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
