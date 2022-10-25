import type { NextApiRequest, NextApiResponse } from "next";
import { gql, GraphQLClient } from "graphql-request";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email, tags, name } = JSON.parse(req.body);

  console.log(email, tags, name);

  const mutation = gql`
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
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

  const variables = {
    input: {
      firstName: name.firstname ? name.firstname : "",
      lastName: name.lastname ? name.lastname : "",
      email: email,
      emailMarketingConsent: {
        consentUpdatedAt: new Date(),
        marketingOptInLevel: "SINGLE_OPT_IN",
        marketingState: "SUBSCRIBED",
      },
      tags: [...tags],
      taxExempt: false,
    },
  };

  const adminGraphClient = new GraphQLClient(
    "https://tor-salon-products.myshopify.com/admin/api/2022-07/graphql.json" as string,
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_PASSWORD as string,
      },
    }
  );

  const response = await adminGraphClient.request(mutation, variables);

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