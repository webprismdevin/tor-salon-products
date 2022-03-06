import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    id?: string,
    cart?: any,
    error?: any
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const query = gql`
      query GetCart {
        cart(id: "${req.query.cartId}") {
          checkoutUrl
          estimatedCost {
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
                    product {
                      title
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
      }
    `;

  const response = await graphClient.request(query);

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));
    res.send({
        error: response.errors
    });
    throw Error("There was a problem creating the cart. Please check logs");
  }

  res.send({
          cart: response.cart
  });
}
