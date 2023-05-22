import { Box, Button, Stack, Text } from "@chakra-ui/react";

import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import { useContext, useEffect, useState } from "react";
import formatter from "../../lib/formatter";
import addToCart from "../../lib/Cart/addToCart";
import CartContext from "../../lib/CartContext";
import { useRouter } from "next/router";
import useAddToCart from "../../lib/useAddToCart";

export default function CartRecommendations() {
  const { cart, setCart } = useContext(CartContext);
  const [recommendations, setRecommendations] = useState<[any] | null>();
  const router = useRouter()
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

    const response = await graphClient.request(query);

    return response;
  }

  useEffect(() => {
    console.log("fired");

    getRecommendations(cart.lines[cart.lines.length - 1].node.merchandise.product.id).then((res:any) =>
      setRecommendations(res.productRecommendations)
    );
  }, [cart.lines]);

  async function handleAddToCart(rec: any) {
    addItemToCart(rec.variants.edges[0].node.id, 1, "");
  }

  if(router.asPath.includes("/offer")) return <></>

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
              {rec.title}{" "}
              {rec.variants.edges[0].node.title !== "Default Title" && (
                <span style={{ color: "gray" }}>
                  {rec.variants.edges[0].node.title}
                </span>
              )}
            </Text>
            <Button variant="outline" onClick={() => handleAddToCart(rec)} size="sm">
              Add for{" "}
              {formatter.format(rec.variants.edges[0].node.priceV2.amount)}
            </Button>
          </Stack>
        ))}
    </Box>
  );
}
