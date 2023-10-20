import { gql } from "graphql-request";
import graphClient from "../graph-client";

export default async function updateCartItemQty(
  cartId: string,
  lineItemId: string,
  qty: number
) {
  const mutation = gql`
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          estimatedCost {
            subtotalAmount {
                amount
            }
            totalAmount {
                amount
            }
        }
          discountCodes {
            applicable
            code
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                estimatedCost {
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                merchandise {
                  ... on ProductVariant {
                    title
                    image {
                      url
                    }
                    product {
                      title
                      id
                      images(first: 1) {
                        edges {
                          node {
                            url
                          }
                        }
                      }
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
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
    lines: {
      id: lineItemId,
      quantity: qty,
    },
  };

  const response = await graphClient.request(mutation, variables);

  return response;
}
