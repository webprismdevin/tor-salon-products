import { gql } from "graphql-request";
import graphClient from "./graph-client";

export type ProductsResponse = {
  collections: {
    edges: {
      node: {
        id: string;
        title: string;
        description: string;
        handle: string;
        products: {
          edges: {
            node: {
              id: string;
              title: string;
              description: string;
              handle: string;
              variants: {
                edges: {
                  node: {
                    id: string;
                  };
                }[];
              };
              images: {
                edges: {
                  node: {
                    altText: string;
                    transformedSrc: string;
                  };
                }[];
              };
              priceRange: {
                maxVariantPrice: {
                  amount: string;
                };
              };
              compareAtPriceRange: {
                maxVariantPrice: {
                  amount: string;
                };
              };
            };
          }[];
        };
      };
    }[];
  };
  errors?: {
    message: string;
  }[];
};

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
              ${PRODUCTS_FRAGMENT}
            }
          }
        }
      }
    }
  `;

  const res = (await graphClient.request(query)) as ProductsResponse;

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  return res;
}

export const PRODUCTS_FRAGMENT = gql`
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
            url
          }
        }
      }
      priceRange {
        maxVariantPrice {
          amount
        }
        minVariantPrice {
          amount
        }
      }
      compareAtPriceRange {
        maxVariantPrice {
          amount
        }
        minVariantPrice {
          amount
        }
      }
    }
  }`;
