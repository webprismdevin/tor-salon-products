import { gql } from "graphql-request";

export const productImageFragment = gql`
  query ($id: ID!) {
    product(id: $id) {
      featuredImage {
        url
        width
        height
        altText
      }
      images(first: 20) {
        edges {
          node {
            url
            width
            height
            altText
          }
        }
      }
    }
  }
`;

export const productFragment = gql`
  query ($id: ID!) {
    product(id: $id) {
      featuredImage {
        url
        width
        height
        altText
      }
      images(first: 20) {
        edges {
          node {
            url
            width
            height
            altText
          }
        }
      }
      variants (first: 10){
        edges {
          node {
            id
            title
            image {
              url
              altText
              height
              width
            }
          }
        }
      }
    }
  }`;
