import {
  Stack,
  Flex,
  Heading,
  Text,
  Box,
  Container,
  SimpleGrid,
  Divider,
  AspectRatio,
  chakra
} from "@chakra-ui/react";
import Product from "../components/Product";
import Head from "next/head";
import { gql, GraphQLClient } from "graphql-request";
import NextImage, { ImageProps } from 'next/image'

const ChakraImage = chakra(NextImage)

const HairCatalog = ({ products }: any) => {
  //to do - add filters

  return (
    <>
      <Head>
        <title>All Hair Products | TOR Salon Products</title>
        <meta name="description" content="" />
      </Head>
      {/* <Stack direction={["column", "row"]}>
        <Stack maxW={["full", "50%"]} px={[8, 20]} py={[20, 20]}>
          <Text fontSize={22} textTransform="uppercase" fontFamily={"Futura"}>
            Salon Grade -
          </Text>
          <Heading size="2xl">Hair Care</Heading>
          <Text maxW="500px">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
            blanditiis ipsa impedit! Veritatis suscipit vero dolore enim, odio
            ut? Cupiditate officia vero veritatis nemo incidunt unde ullam
            maiores aut. Libero.
          </Text>
        </Stack>
        <AspectRatio ratio={1/1} w={["full", "50%"]}>
          <ChakraImage src="" layout="fill" objectFit={"cover"}/>
        </AspectRatio>
      </Stack> */}
      <Container maxW="container.xl" py={40}>
        <Heading mb={6} size="2xl" textAlign="center">
          All Hair Care
        </Heading>
        <Divider />
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
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
      },
    }
  );

  // Shopify Request
  const query = gql`
    {
      products(
        first: 200,
        query: "product_type:Bundle OR product_type:Conditioners OR product_type:Shampoo OR product_type:Styling Products",
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
