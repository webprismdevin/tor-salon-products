import {
  Flex,
  Stack,
  Container,
  Heading,
  VStack,
  Box,
  Text,
  Button,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { groq } from "next-sanity";
import { getClient, imageBuilder } from "../lib/sanity";
import { gql, GraphQLClient } from "graphql-request";
import { isMobile } from "react-device-detect";
import { FaCheckCircle, FaEdit, FaRunning, FaWrench } from "react-icons/fa";
import Product from "../components/Product";
import MailingList from "../components/MailingList";
import ShopContext from "../lib/shop-context";

function HomePage({ homepageData, collection }: any) {
  const { shop } = useContext(ShopContext)

  return (
    <>
      <Head>
        <title>{shop.name}</title>
        <meta
          name="description"
          content=""
        />
      </Head>
      <Container py={20}>

      </Container>
    </>
  );
}

export default HomePage;

export async function getStaticProps() {
  const homepageQuery = groq`*[_type == "homepage"]{
    heroTitle, heroSubtitle, heroImage, about, aboutImage
  }[0]`;

  const homepageData = await getClient(false).fetch(homepageQuery, {});

  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_SHOPIFY_URL!, {
    headers: {
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN!,
    },
  });

  // Shopify Request
  const query = gql`
    {
      collectionByHandle(handle: "home") {
        id
        title
        products(first: 4) {
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
  `;

  const res = await graphQLClient.request(query);

  if (res.errors) {
    console.log(JSON.stringify(res.errors, null, 2));
    throw Error("Unable to retrieve Shopify Products. Please check logs");
  }

  return {
    props: {
      homepageData,
      collection: res.collectionByHandle,
    },
    revalidate: 3600,
  };
}
