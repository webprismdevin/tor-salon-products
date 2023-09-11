import { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";
import { adminGraphClient } from "../../lib/shopify-client";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // get URL params from the request
  // email, tag and redirect
  const { em, t, redir } = req.query;

    // get the customer ID from the email
    const query = gql`
        query getCustomers($email: String!) {
            customers(first: 10, query: $email) {
                edges {
                    node {
                        id
                        email
                        tags
                    }
                }
            }
        }
    `;

    const queryVariables = {
        email: decodeURIComponent(em as string),
    };

    const response: any = await adminGraphClient.request(query, queryVariables);

    // if the customer exists, update the tags
    if (response.customers.edges.length > 0) {
        const updateMutation = gql`
            mutation customerUpdate($input: CustomerInput!) {
                customerUpdate(input: $input) {
                    customer {
                        id
                        firstName
                        lastName
                        tags
                        email
                        phone
                        taxExempt
                        acceptsMarketing
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;
        const updateVariables = {
            input: {
                id: response.customers.edges[0].node.id,
                email: decodeURIComponent(em as string),
                tags: [decodeURIComponent(t as string), ...response.customers.edges[0].node.tags],
            },
        };

        const updateResponse: any = await adminGraphClient.request(
            updateMutation,
            updateVariables
        );

        res.redirect(307, `${decodeURIComponent(redir as string)}`);
    }

    if(response.errors) {
        res.redirect(307, `${decodeURIComponent(redir as string)}`);
    }
}
