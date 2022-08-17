import { gql } from "graphql-request";
import graphClient from "../graph-client";

export default async function addToCart(cartId:string, variantId:string, qty?:number){

    const query = gql`
      mutation AddToCart($cartId: ID!, $variantId: ID! ) {
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
  
    const response = await graphClient.request(query, { cartId, variantId });

    return response;
}