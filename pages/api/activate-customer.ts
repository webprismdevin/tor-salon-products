import graphClient from "../../lib/graph-client";
import { gql } from 'graphql-request';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = JSON.parse(req.body);

  const mutation = gql`
    mutation ($activationUrl: URL!, $password: String!) {
      customerActivateByUrl(
        activationUrl: $activationUrl
        password: $password
      ) {
        customer {
          id
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
    activationUrl: data.activationUrl,
    password: data.password,
  };

  const response = await graphClient.request(mutation, variables);

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));
    res.send({
      error: response.errors,
    });
    throw Error('There was a problem creating the cart. Please check logs');
  }

  res.send({
    data: response,
  });
}
