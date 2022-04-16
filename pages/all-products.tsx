import { Stack, Flex, Heading, Text, Box } from "@chakra-ui/react";
import Product from "../components/Product";
import Head from "next/head";
import getProducts from '../lib/get-products'

const Catalog = ({ collections }: any) => {
  //to do - add filters

  return (
    <>
      <Head>
        <title>All Hair Products | TOR Salon Products</title>
      </Head>
      <Box>
        {collections.edges.map((collection: any) => (
          <Flex
            key={collection.node.id}
            p={[4, 40]}
            pt={[40, 40]}
            w="100%"
            flexDirection={["column", "row"]}
            alignItems={["center", "flex-start"]}
            gap={10}
            id={collection.node.handle}
          >
            <Stack
              direction="column"
              w={["100%", "30%"]}
              pos={["static", "sticky"]}
              top={40}
            >
              <Heading>{collection.node.title}</Heading>
              <Text textAlign="justify" >{collection.node.description}</Text>
            </Stack>
            <Flex
              justifyContent={["center", "flex-end"]}
              gap={8}
              direction="row"
              alignItems="center"
              w={["full", "70%"]}
              flexWrap="wrap"
            >
              {process.browser && collection.node.products.edges.map((product: any) => (
                <Product
                  product={product}
                  key={product.node.id}
                />
              ))}
            </Flex>
          </Flex>
        ))}
      </Box>
    </>
  );
};

export default Catalog;

export async function getStaticProps() {
  const res = await getProducts();

  return {
    props: {
      collections: res.collections,
    },
    revalidate: 60,
  };
}
