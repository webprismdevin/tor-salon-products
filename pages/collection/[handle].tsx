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
import NextLink from "next/link";
import ProductFeature from "../../components/ProductFeature";

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
      <Flex
        flexDir={"row"}
        // bgImage={data.image.url}
        // bgPos="left"
        // bgAttachment={["scroll"]}
        // bgSize="cover"
      >
        <Stack
          direction={["column"]}
          gap={12}
          w="50%"
          px={20}
          py={40}
          bg="white"
        >
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

const Product = ({ product }: { product: any }) => {
  const prod = product.node;

  return (
    <NextLink href={`/product/${prod.handle}`} passHref>
      <GridItem
        colSpan={1}
        textAlign="center"
        placeItems={"center"}
        display={"grid"}
        pos={"relative"}
      >
        {/* <IconButton size={"lg"} _hover={{opacity: 0.4}} aria-label="add to cart" icon={<Icon as={BsCartPlus} />} variant={"unstyled"} position={"absolute"} top={0} right={0} zIndex={1}/> */}
        <AspectRatio ratio={1 / 1} boxSize={300}>
          <Image src={prod.images.edges[0]?.node.url} alt={prod.title} />
        </AspectRatio>
        <Text fontSize="32px" maxW="300px" lineHeight={1.3}>
          {prod.title}
        </Text>
      </GridItem>
    </NextLink>
  );
};

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

  // Shopify Request
  const query = gql`{
        collection(handle: "${handle}"){
        title
        description
        image {
          url
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
