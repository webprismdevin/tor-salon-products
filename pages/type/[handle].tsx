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
import ProductFeature from "../../components/ProductFeature";
import Product from "../../components/Product/Product";

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
        <meta name="description" content={data.description} />
      </Head>
      <Flex
        flexDir={["column-reverse", "row"]}
        bg={data.color?.value ? data.color.value : "white"}
        overflow={["visible", "hidden"]}
      >
        <Box w={["full", "50%"]} px={[8, 20]} py={[20, 20]} pos="relative">
          <Image
            src={data.typeImage.reference.image.url}
            alt=""
            pos={["absolute"]}
            top={[20, 20]}
            opacity={0.1}
            w="80%"
            left={["10%", 0]}
            zIndex={0}
            userSelect="none"
          />
          <Stack direction={["column"]} spacing={6} pos="relative" zIndex={1}>
            <Heading as="h1">{data.title}</Heading>
            <Box
            maxW={600}
            dangerouslySetInnerHTML={{
              __html: data.descriptionHtml
            }} />
            <Stack
              direction={"row"}
              textAlign="left"
              justify="flex-start"
              spacing={6}
            >
              <Box w="120px">
                <Image
                  mb={2}
                  boxSize={6}
                  src={data.benefitOneIcon?.reference.image.url}
                  alt={data.benefitOneText?.value}
                />
                <Text>{data.benefitOneText?.value}</Text>
              </Box>
              <Box w="120px">
                <Image
                  mb={2}
                  boxSize={6}
                  src={data.benefitTwoIcon?.reference.image.url}
                  alt={data.benefitTwoText?.value}
                />
                <Text>{data.benefitTwoText?.value}</Text>
              </Box>
              <Box w="120px">
                <Image
                  mb={2}
                  boxSize={6}
                  src={data.benefitThreeIcon?.reference.image.url}
                  alt={data.benefitThreeText?.value}
                />
                <Text>{data.benefitThreeText?.value}</Text>
              </Box>
            </Stack>
          </Stack>
        </Box>
        <AspectRatio ratio={1 / 1} w={["full", "50%"]}>
          <Image src={data.image.url} alt="" />
        </AspectRatio>
      </Flex>
      <ProductFeature reference={data.products.edges[0].node} />
      <Container maxW="container.xl" pt={10} pb={20}>
        <SimpleGrid templateColumns={"repeat(3, 1fr)"} w="full" gap={12}>
          {data.products.edges.map((p: any, index: number) => index !== 0 && (
            <Product product={p} key={p.node.id} fontSize={24} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { handle: "fine-thin" } },
      { params: { handle: "medium-thick" } },
      { params: { handle: "curly" } },
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
    collection(handle: "${handle}") {
      title
      description
      descriptionHtml
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
      color: metafield(namespace: "collection", key: "color") {
        value
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
                  priceV2 {
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
      products(first: 100) {
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
  }
  `;

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
