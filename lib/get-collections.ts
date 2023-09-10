import graphClient from "./graph-client";
import { gql } from "graphql-request";

export type CollectionResponse = {
  collections: {
    edges: {
      node: {
        handle: string;
        title: string;
      };
    }[];
  };
  errors?: {
    message: string;
  }[];
};

//gets all collections and filters out homepage collections
export default async function getCollections(ignore: string) {
  const query = gql`
    {
      collections(first: 10, query: "NOT ${ignore}", sortKey: TITLE) {
        edges {
          node {
            handle
            title
          }
        }
      }
    }
  `;

  const response = await graphClient.request(query) as CollectionResponse;

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));

    throw Error("There was a problem getting the variant. Please check logs");
  }

  return response;
}
