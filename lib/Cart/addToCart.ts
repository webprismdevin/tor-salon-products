import { gql } from "graphql-request";
import graphClient from "../graph-client";

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
  
    const variables = sellingPlanId !== "" ? { cartId, variantId, sellingPlanId } : { cartId, variantId }

    const response = await graphClient.request(query, variables)

    // console.log(response, variables, query);

    const merchandise = response.cartLinesAdd.cart.lines.edges[0].node.merchandise

    // console.log(merchandise, "atc fired")

    if (window.dataLayer) {
      // const merchandise = response.cartLinesAdd.cart.lines.edges[0].node.merchandise

      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          items: [
            {
              item_id: merchandise.id,
              item_name: merchandise.product.title,
              affiliation: "Storefront",
              item_brand: "TOR",
              value: merchandise.priceV2.amount,
              item_variant: merchandise.title,
              currency: "USD",
              item_category: merchandise.productType,
            },
          ],
        },
      });
    }

    return response;
}