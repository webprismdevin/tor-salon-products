import { gql } from "graphql-request";
import graphClient from "./graph-client";


export default async function getProducts() {
  // Shopify Request
  const query = gql`
    {
      collections(first: 12, query: "NOT home") {
        edges {
          node {
            id
            title
            description
            handle
            products(first: 100) {
              edges {
                node {
                  id
                  title
                  description
                  handle
                  variants(first: 1) {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                  images(first: 2) {
                    edges {
                      node {
                        altText
                        transformedSrc
                      }
                    }
                  }
                  priceRange {
                    maxVariantPrice {
                      amount
                    }
                  }
                  compareAtPriceRange {
                    maxVariantPrice {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await graphClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  console.log(res)

  return res;
}
