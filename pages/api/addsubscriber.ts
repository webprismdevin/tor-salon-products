import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "node:crypto";
import graphClient from "../../lib/graph-client";
import { gql, GraphQLClient } from "graphql-request";

type Data = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { email, hairType } = JSON.parse(req.body);

  console.log(email, hairType);

  const sub_hash = crypto.createHash("md5").update(email).digest("hex");

  const mutation = gql`mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
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
    }`;

  const variables = {
    input: {
      email: email,
      emailMarketingConsent: {
        consentUpdatedAt: new Date(),
        marketingOptInLevel: "SINGLE_OPT_IN",
        marketingState: "SUBSCRIBED",
      },
      tags: [hairType],
      taxExempt: false,
    },
  };

  const adminGraphClient = new GraphQLClient(
    'https://tor-salon-products.myshopify.com/admin/api/2022-07/graphql.json' as string,
    {
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_API_PASSWORD as string,
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

  // const response = await fetch(`https://us18.api.mailchimp.com/3.0/lists/d825e3184f/members/${await sub_hash}?skip_merge_validation=true`, {
  //     method: 'PUT',
  //     headers: {
  //         'Authorization': `Basic ${process.env.MC_API_KEY}`
  //     },
  //     body: JSON.stringify({
  //         email_address: email,
  //         status: "subscribed",
  //         status_if_new: "subscribed",
  //         tags: [hairType]
  //     })
  // }).then(res => res.json())

  // if(response.error){
  //     res.send({
  //         data: {
  //             success: false,
  //             response: response.error
  //         }
  //     })

  //     throw(response.error)
  // }

  // res.send({
  //     data: {
  //         success: true,
  //         response: response
  //     }
  // })
}
