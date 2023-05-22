import graphClient from "../../lib/graph-client";
import { gql } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
){

    const data = JSON.parse(req.body);

    const mutation = gql`
    mutation customerResetByUrl($password: String!, $resetUrl: URL!) {
        customerResetByUrl(password: $password, resetUrl: $resetUrl) {
          customer {
            id
          }
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
      `

      const variables = {
        "password": data.new_password,
        "resetUrl": data.resetUrl
      }
  
    const response:any = await graphClient.request(mutation, variables);
  
    if (response.errors) {
      console.log(JSON.stringify(response.errors, null, 2));
      res.send({
        error: response.errors,
      });
      throw Error("There was a problem creating the cart. Please check logs");
    }
    console.log(response);
  
    // const response = "ok"
  
    res.send({
      response: response,
    });
}