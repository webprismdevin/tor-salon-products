import { gql } from "graphql-request";
import graphClient from "../graph-client";

export type DiscountCodeResponse = {
  cartDiscountCodesUpdate: {
    cart: {
      discountCodes: {
        applicable: boolean;
        code: string;
      }[];
    };
    userErrors: {
      field: string;
      message: string;
    }[];
  };
  error?: {
    message: string;
  }[];
};

export default async function applyDiscountToCart(
  cartId: string,
  discountCode: string
) {
  const mutation = gql`
    mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
      cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
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
    cartId: cartId,
    discountCodes: [discountCode],
  };

  const response = await graphClient.request(mutation, variables);

  return response as DiscountCodeResponse;
}
