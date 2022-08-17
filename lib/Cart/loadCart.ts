import graphClient from "../graph-client";
import { gql } from "graphql-request";

export default async function loadCart(cartId: string) {
  const query = gql`query GetCart {
        cart(id: "${cartId}") {
            checkoutUrl
            discountCodes {
                applicable
                code
            }
            estimatedCost {
                subtotalAmount {
                    amount
                }
                totalAmount {
                    amount
                }
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
                    id
                    image {
                        url
                    }
                    product {
                        id
                        title
                        images(first: 3) {
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
        }
        `;

  const response = await graphClient.request(query);

  return response;
}
