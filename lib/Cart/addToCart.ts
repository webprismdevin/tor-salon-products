import { gql } from "graphql-request";
import graphClient from "../graph-client";

export default async function addToCart(cartId:string, variantId:string, qty?:number, sellingPlanId?: string){

    const query = sellingPlanId !== "none" ? gql`
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
                      product {
                        title
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
                      product {
                        title
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
  
    const variables = sellingPlanId !== "none" ? { cartId, variantId, sellingPlanId } : { cartId, variantId }

    const response = await graphClient.request(query, variables)

    console.log(response, variables, query)

    return response;
}