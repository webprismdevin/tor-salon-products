import { CartResponse } from "components/Cart/Cart";
import { gql } from "graphql-request";
import { usePlausible } from "next-plausible";
import graphClient from "../graph-client";

export type AddToCartResponse = {
  cartLinesAdd: {
    cart: CartResponse;
    userErrors: {
      field: string;
      message: string;
    }[];
  };
  error?: {
    message: string;
  }[];
};

export default async function addToCart(cartId:string, variantId:string, qty?:number, sellingPlanId?: string){

    const query = sellingPlanId !== "" ? gql`
      mutation AddToCart($cartId: ID!, $variantId: ID!, $sellingPlanId: ID!) {
        cartLinesAdd(
          cartId: $cartId
          lines: [{ quantity: ${qty ? qty : 1}, merchandiseId: $variantId, sellingPlanId: $sellingPlanId }]
        ) {
          cart {
            discountCodes {
              applicable
              code
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      priceV2 {
                        amount
                      }
                      title
                      product {
                        title
                        id
                        productType
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    ` :
    gql`
      mutation AddToCart($cartId: ID!, $variantId: ID!) {
        cartLinesAdd(
          cartId: $cartId
          lines: [{ quantity: ${qty ? qty : 1}, merchandiseId: $variantId }]
        ) {
          cart {
            discountCodes {
              applicable
              code
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      priceV2 {
                        amount
                      }
                      title
                      product {
                        title
                        id
                        productType
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  
    const variables:any = sellingPlanId !== "" ? { cartId, variantId, sellingPlanId } : { cartId, variantId }

    const response = await graphClient.request(query, variables) as AddToCartResponse;

    return response;
}