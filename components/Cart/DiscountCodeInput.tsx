import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useToast,
} from "@chakra-ui/react";
import { gql } from "graphql-request";
import { useContext, useEffect, useState } from "react";
import applyDiscountToCart from "../../lib/Cart/applyDiscountToCart";
import { CartContext } from "../../app/cart-provider";
import graphClient from "../../lib/graph-client";

export default function DiscountCodeInput() {
  const [code, setCode] = useState("");
  const { cart, setCart } = useContext(CartContext);
  const toast = useToast();

  async function applyDiscount() {
    const response:any = await applyDiscountToCart(cart.id, code);

    if (response.error) {
      toast({
        title: "Code could not be added!",
        description: "Hmmm...try again or try a different code",
        status: "error",
      });
    }

    toast({
      title: "Code added!",
      description: "Check your cart total!",
      status: "success",
    });

    setCart({
      ...cart,
      status: "dirty",
    });

    setCode("");
  }

  async function clearCode() {
    const mutation = gql`
      mutation cartDiscountCodesUpdate(
        $cartId: ID!
        $discountCodes: [String!]
      ) {
        cartDiscountCodesUpdate(
          cartId: $cartId
          discountCodes: $discountCodes
        ) {
          cart {
            discountCodes {
              applicable
              code
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      cartId: cart.id,
      discountCodes: [],
    };

    const response = await graphClient.request(mutation, variables);

    setCart({
      ...cart,
      status: "dirty",
    });
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") applyDiscount();
  };

  return (
    <Box w="full">
      {cart && cart.discount && cart.discount.length > 0 && (
        <Flex py={2}>
          <Text>Discount Applied:</Text>
          {cart.discount.map((discount: any) => (
            <Tag ml={2} size="md" key={0}>
              <TagLabel>{discount.code}</TagLabel>
              <TagCloseButton onClick={clearCode} />
            </Tag>
          ))}
        </Flex>
      )}
      <InputGroup>
        <Input
          placeholder="Enter promo code"
          onChange={(e) => setCode(e.target.value)}
          value={code}
          onKeyDown={handleKeyDown}
        />
        <InputRightElement width="4.5rem">
          <Button
            disabled={code === ""}
            onClick={applyDiscount}
            size="sm"
            variant={"outline"}
          >
            Apply
          </Button>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
