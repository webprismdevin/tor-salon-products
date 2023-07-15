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
        mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
            customerUserErrors {
            code
            field
            message
            }
            customer {
            id
            }
        }
        }
    `;

    const variables = {
        input: requestData
    };

    const response = await graphClient.request(mutation, variables) as any;

    if (response.errors) {
        console.log(JSON.stringify(response.errors, null, 2));
        res.send({
        error: response.errors,
        });
        throw Error("There was a problem creating the user. Please check logs");
    }

    res.send({
        response: response
    });
}
