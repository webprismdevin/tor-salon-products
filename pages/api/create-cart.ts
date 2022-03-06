import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    id?: string,
    checkoutUrl?: string,
    error?: any
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const mutation = gql`
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  const response = await graphClient.request(mutation);

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));
    res.send({
        error: response.errors
    });
    throw Error("There was a problem creating the cart. Please check logs");
  }

  res.send({
          id: response.cartCreate?.cart?.id,
          checkoutUrl: response.cartCreate?.cart?.checkoutUrl
  });
}
