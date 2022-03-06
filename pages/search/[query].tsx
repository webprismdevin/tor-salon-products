import { Heading, Container, Box, Flex } from "@chakra-ui/react";
import { gql, GraphQLClient } from "graphql-request";
import ProductCard from "../../components/Product";
import Head from "next/head";
import { GetServerSideProps } from "next";

const Search = ({ results, searchTerm }: { results: any, searchTerm: string}) => {
  return (
    <Box mt={20}>
      <Head>
        <title>Search results for &quot;{searchTerm}&quot;</title>
      </Head>
      <Container py={6} maxW="container.xl">
        <Heading >Search results for &quot;{searchTerm}&quot;</Heading>
      </Container>
      <Container maxW="container.xl" pt={10} pb={20}>
        <Flex flexDirection={["column", "row"]} justifyContent={"space-between"} gap={[4]} minW="full" flexWrap={'wrap'}>
          {results.edges.map((p: any) => (
            <Box key={p.node.id}>
              <ProductCard product={p} />
            </Box>
          ))}
        </Flex>
      </Container>
    </Box>
  );
};

export default Search;

export const getServerSideProps : GetServerSideProps = async (context) => {
  const searchQuery = context.params?.query;

  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_SHOPIFY_URL!, {
    headers: {
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
    },
  });

  // Shopify Request
  const query = gql`{
        products(query: "${searchQuery} ", first: 100) {
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
      }`;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  return {
    props: {
      results: res.products,
      searchTerm: searchQuery 
    },
  };
}
