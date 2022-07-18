import { gql } from "graphql-request";
import graphClient from "../graph-client";

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

  return response;
}
