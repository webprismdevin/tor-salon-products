import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id?: string;
  variantId?: any;
  error?: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = JSON.parse(req.body);

  const variables = {
    "handle": data.handle,
    "option1": {
      "name": Object.keys(data.options)[0],
      "value": Object.values(data.options)[0]
    }, 
    "option2": {
      "name": Object.keys(data.options)[1],
      "value": Object.values(data.options)[0]
    }
  }

  console.log(variables)

  const query = gql`
  query productByOptions($handle: String, $option1: SelectedOptionInput!, $option2: SelectedOptionInput!){
    product(handle: $handle){
      variantBySelectedOptions(selectedOptions: [$option1, $option2]) {
        id
      }
    }
  }
  `;

  const response = await graphClient.request(query, variables);

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));
    res.send({
      error: response.errors,
    });
    throw Error("There was a problem getting the variant. Please check logs");
  }

  console.log(await response)

  res.send({
    variantId: await response.product.variantBySelectedOptions.id
  });
}
