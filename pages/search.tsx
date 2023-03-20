import { Heading, Container, Box, Flex, SimpleGrid, GridItem } from "@chakra-ui/react";
import { gql, GraphQLClient } from "graphql-request";
import Product from "../components/Product/Product";
import Head from "next/head";
import { GetServerSideProps } from "next";

const Search = ({
  results,
  searchTerm,
}: {
  results: any;
  searchTerm: string;
}) => {
  return (
    <Box mt={20}>
      <Head>
        <title>Search results for &quot;{searchTerm}&quot;</title>
      </Head>
      <Container py={6} maxW="container.xl">
        <Heading textTransform={"capitalize"}>{searchTerm}</Heading>
      </Container>
      <Container maxW="container.xl" pt={10} pb={20}>
        <SimpleGrid templateColumns={"repeat(3, 1fr)"}>
          {results.edges.map((p: any) => (
              <Product product={p} key={p.node.id} />
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async ({
  query: urlQuery,
}) => {
  const searchQuery = urlQuery.query;

  console.log(urlQuery, searchQuery);

  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SHOPIFY_URL!,
    {
      headers: {
        "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
      },
    }
  );

  // Shopify Request
  const query = gql`{
        products(query: "${searchQuery} NOT product_type:Promo", first: 100) {
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
      }`;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  return {
    props: {
      results: res.products,
      searchTerm: searchQuery,
    },
  };
};
