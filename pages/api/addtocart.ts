import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  cartId?: string;
  variantId?: any;
  error?: any;
  response?: boolean,
  qty?: number
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { cartId, variantId, qty } = JSON.parse(req.body);

  const query = gql`
    mutation AddToCart($cartId: ID!, $variantId: ID! ) {
      cartLinesAdd(
        cartId: $cartId
        lines: [{ quantity: ${qty ? qty : 1}, merchandiseId: $variantId }]
      ) {
        cart {
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
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

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));
    res.send({
      error: response.errors,
    });
    throw Error("There was a problem creating the cart. Please check logs");
  }
  res.send({
    response: response
  });
}
