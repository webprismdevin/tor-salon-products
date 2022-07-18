import { gql, GraphQLClient } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query = gql`
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
        }
      }
    }
  `;

//   const adminGraphClient = new GraphQLClient(
//     "https://tor-salon-products.myshopify.com/admin/api/2022-01/graphql.json" as string,
//     {
//       headers: {
//         "X-Shopify-Access-Token": process.env.SHOPIFY_API_PASSWORD as string,
//       },
//     }
//   );

  const variables = JSON.parse(req.body);

  console.log(variables)

//   const response = await adminGraphClient.request(query, variables);

//   if (response.errors) {
//     console.log(JSON.stringify(response.errors, null, 2));
//     res.send({
//       error: response.errors,
//     });
//     throw Error("There was a problem creating the cart. Please check logs");
//   }


  res.send({
    // response: response,
    response: true
  });
}
