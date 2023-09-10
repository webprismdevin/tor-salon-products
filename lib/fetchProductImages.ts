import { gql } from "graphql-request";
import graphClient from "./graph-client";

export interface FetchProductProps {
    gid: string
}

export default async function fetchProductImages({ gid }: FetchProductProps){

    const query = gql`query($id: ID!){
        product(id: $id) {
        images(first:20){
                edges {
                    node {
              url
            }
          }
        }
        }
    }`

    const response = await graphClient.request(query, { id: gid});

    return response;
}