import { Box, Button, Stack, Text } from "@chakra-ui/react";
import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import { useContext, useEffect, useState } from "react";
import formatter from "../../lib/formatter";
import { CartContext } from "../../app/cart-provider";
import useAddToCart from "../../lib/useAddToCart";

type RecommendationsResponse = {
  productRecommendations: [
    {
      title: string;
      id: string;
      productType: string;
      variants: {
        edges: [
          {
            node: {
              id: string;
              title: string;
              priceV2: {
                amount: string;
                currencyCode: string;
              };
            };
          }
        ];
      };
    }
  ];
};

export default function CartRecommendations() {
  const { cart, setCart } = useContext(CartContext);
  const [recommendations, setRecommendations] = useState<[any] | null>();
  const { addItemToCart } = useAddToCart();

  async function getRecommendations(productId: string) {
    const query = gql`{
            productRecommendations(productId: "${productId}") {
              title
              id
              productType
              variants(first: 1) {
                edges {
                    node {
                        id
                        title
                        priceV2 {
                            amount
                            currencyCode
                        }
                    }
                }
              }
            }
          }`;

    const response = (await graphClient.request(
      query
    )) as RecommendationsResponse;

    return response;
  }

  useEffect(() => {
    getRecommendations(
      // @ts-ignore
      cart.lines[cart.lines.length - 1].node.merchandise.product.id
    ).then((res: any) => setRecommendations(res.productRecommendations));
  }, [cart.lines]);

  async function handleAddToCart(rec: any) {
    addItemToCart(rec.variants.edges[0].node.id, 1, "");
  }

  return (
    <Box w="full" display={["none", null, "block"]}>
      <Text size="md" fontWeight="bold">
        Recommended For You
      </Text>
      {recommendations &&
        recommendations.slice(0, 3).map((rec) => (
          <Stack
            direction="row"
            align="center"
            justify={"space-between"}
            my={2}
            w="full"
            key={rec.id}
          >
            <Text>
              {rec.title}
            </Text>
            <Button
              variant="outline"
              onClick={() => handleAddToCart(rec)}
              size="sm"
              borderRadius={0}
            >
              Add for{" "}
              {formatter.format(rec.variants.edges[0].node.priceV2.amount)}
            </Button>
          </Stack>
        ))}
    </Box>
  );
}
