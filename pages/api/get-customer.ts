import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const mutation = gql`
    query {
      customer(customerAccessToken: "${req.query.accessToken}") {
        id
        firstName
        lastName
        email
        tags
        orders(first: 100, reverse: true) {
          edges {
            node {
              id
              currentTotalPrice {
								amount
              }
              processedAt
              orderNumber
              fulfillmentStatus
              lineItems (first: 100) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response:any = await graphClient.request(mutation);

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));
    res.send({
      error: response.errors,
    });
    throw Error("There was a problem creating the user. Please check logs");
  }

  res.send({
     data: response,
  });
}
