import type { NextApiRequest, NextApiResponse } from "next";
import { gql, GraphQLClient } from "graphql-request";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email, tags, name } = JSON.parse(req.body);

  console.log(email, tags, name);

  const adminGraphClient = new GraphQLClient(
    "https://tor-salon-products.myshopify.com/admin/api/2022-07/graphql.json" as string,
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_PASSWORD as string,
      },
    }
  );

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
    email: email,
  };

  const response = await adminGraphClient.request(query, queryVariables);

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
        email: email,
        tags: [...tags, ...response.customers.edges[0].node.tags],
      },
    };

    const updateResponse = await adminGraphClient.request(
      updateMutation,
      updateVariables
    );

    if (response.errors) {
      console.log(JSON.stringify(response.errors, null, 2));
      res.send({
        error: updateResponse.errors,
      });
      throw Error("There was a problem creating the user. Please check logs");
    }

    res.send({
      data: 'updated',
    });
  } else if(response.customers.edges.length === 0) {
    const createMutation = gql`
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

    const createVariables = {
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

    const createResponse = await adminGraphClient.request(
      createMutation,
      createVariables
    );

    if (createResponse.errors) {
      console.log(JSON.stringify(createResponse.errors, null, 2));
      res.send({
        error: createResponse.errors,
      });
      throw Error("There was a problem creating the user. Please check logs");
    }

    res.send({
      data: 'created'
    });
  }
}
