import {
  Box,
  Button,
  Container,
  Divider,
  Heading,
  IconButton,
  Select,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { gql, GraphQLClient } from "graphql-request";
import { useContext, useEffect, useState } from "react";
import CartContext from "../lib/CartContext";
import formatter from "../lib/formatter";

interface OrderObject {
  pid: string;
  vid: string;
  qty: number;
}

// add link to instruction video in header
// add other benefits
// add shipping policy for wholesale orders
// add total price (MSRP & wholesale)
// add link to download retail & wholesale pricing guide PDF

export default function Wholesale({ products }: any) {
  const [order, updateOrder] = useState<OrderObject[]>([]);
  const [type, setType] = useState("");
  const [filteredProducts, setProducts] = useState(products);
  const [cart, setCart] = useState<any>(null);

  const typeSet = new Set(
    products.map((product: any) => product.node.productType)
  );

  function addToOrder(vid: string, pid: string) {
    updateOrder((prevState) => [...order, { vid, pid, qty: 1 }]);
  }

  function nameLookup(pid: string, vid: string) {
    const product = products.find((item: any) => item.node.id === pid);

    const variant = product.node.variants.edges.find(
      (v: any) => v.node.id === vid
    );

    return { title: product?.node.title, vTitle: variant?.node.title };
  }

  function removeItem(vid: string) {
    const newArray = order.filter((item) => item.vid !== vid);

    updateOrder(newArray);
  }

  useEffect(() => {
    if (type === "") setProducts(products);

    if (type !== "")
      setProducts(
        products.filter((prod: any) => prod.node.productType === type)
      );
  }, [type]);

  function addQty(vid: string) {
    const lineItem = order.find((item: any) => item.vid === vid);
    const lineItemIndex = order.findIndex((item: any) => item.vid === vid);
    const newOrder = order.filter((item: any) => item.vid !== vid);
    const newLineItem = { ...lineItem, qty: lineItem!.qty + 1 };

    newOrder.splice(lineItemIndex, 0, newLineItem as OrderObject);

    updateOrder([...newOrder]);
  }

  function removeQty(vid: string) {
    const lineItem = order.find((item: any) => item.vid === vid);
    const lineItemIndex = order.findIndex((item: any) => item.vid === vid);
    const newOrder = order.filter((item: any) => item.vid !== vid);
    const newLineItem = { ...lineItem, qty: lineItem!.qty - 1 };

    newOrder.splice(lineItemIndex, 0, newLineItem as OrderObject);

    updateOrder([...newOrder]);
  }

  function submitOrder() {}

  return (
    <Container py={20} maxW="container.xl">
      <Stack py={10}>
        <Heading as="h1" size="2xl">
          Order Wholesale
        </Heading>
      </Stack>
      <Stack direction="row" spacing={10} align="flex-start" pos="relative">
        <Stack minW={350} pos="sticky" top={40} spacing={8}>
          <Stack spacing={4}>
            <Heading size="lg">Filters</Heading>
            <Select maxW={300} onChange={(e) => setType(e.target.value)}>
              <option value="">Show all</option>
              {Array.from(typeSet).map((pt: any) => (
                <option key={pt} value={pt}>
                  {pt}
                </option>
              ))}
            </Select>
          </Stack>
          <Stack spacing={4}>
            <Heading size="lg">Your Order</Heading>
            <Divider />
            {order.map((item) => {
              const names = nameLookup(item.pid, item.vid);
              return (
                <Stack key={item.vid} w="100%">
                  <Text fontWeight={600}>{names.title}</Text>
                  <Stack direction="row" justify={"space-between"}>
                    <Text>{names.vTitle}</Text>
                    <Stack direction="row" spacing={2} align="center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeQty(item.vid)}
                        disabled={item.qty < 2}
                      >
                        -
                      </Button>
                      <Text>{item.qty}x</Text>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addQty(item.vid)}
                      >
                        +
                      </Button>
                    </Stack>
                  </Stack>
                  <Button
                    variant="outline"
                    size="sm"
                    alignSelf={"flex-end"}
                    onClick={() => removeItem(item.vid)}
                  >
                    Remove
                  </Button>
                </Stack>
              );
            })}
            <Divider />
            <Button onClick={submitOrder}>Submit Order</Button>
          </Stack>
        </Stack>
        <Stack spacing={6} w="full">
          {filteredProducts.map((p: any) => (
            <Box key={p.node.id} p={6} shadow="md">
              <Tag size="sm">{p.node.productType}</Tag>
              <Text fontWeight={600} fontSize="2xl">
                {p.node.title}
              </Text>
              <Stack py={4}>
                {p.node.variants.edges.map((v: any) => (
                  <Stack
                    direction="row"
                    key={v.node.id}
                    align="center"
                    justify={"space-between"}
                  >
                    <Text>{v.node.title}</Text>
                    <Stack direction="row" align="center">
                      <Text>{formatter.format(v.node.priceV2.amount / 2)}</Text>
                      <Button
                        disabled={order.some((i) => i.vid === v.node.id)}
                        onClick={() => addToOrder(v.node.id, p.node.id)}
                        size="sm"
                      >
                        {order.some((i) => i.vid === v.node.id)
                          ? "Already in order"
                          : "Add To Order"}
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}

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
        first: 200
        query: "tag_not:Bundle AND tag_not:gift_card AND NOT product_type:Candles"
        sortKey: PRODUCT_TYPE
      ) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            variants(first: 3) {
              edges {
                node {
                  id
                  title
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
