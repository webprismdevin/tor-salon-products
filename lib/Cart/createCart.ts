import { gql } from "graphql-request";
import graphClient from "../graph-client";

export default async function createCart(){
    const mutation = gql`
    mutation CreateCart {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  const response = await graphClient.request(mutation);

  return response;
}