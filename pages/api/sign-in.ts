import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const requestData = JSON.parse(req.body);

  const mutation = gql`
    mutation customerAccessTokenCreate(
      $input: CustomerAccessTokenCreateInput!
    ) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      email: requestData.email,
      password: requestData.password,
    },
  };

  const response = await graphClient.request(mutation, variables) as any;

  res.send({
    ...response.customerAccessTokenCreate,
  });
}
