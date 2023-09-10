import { createStorefrontClient } from "@shopify/hydrogen-react";
import { GraphQLClient } from "graphql-request";

const client = createStorefrontClient({
  publicStorefrontToken: "a37e8b74cb52b6e0609c948c43bb0a5c",
  storeDomain: "tor-salon-products.myshopify.com",
  storefrontApiVersion: process.env.SHOPIFY_API_VERSION!,
});

export const getStorefrontApiUrl = client.getStorefrontApiUrl;
export const getPrivateTokenHeaders = client.getPrivateTokenHeaders;

export const adminGraphClient = new GraphQLClient(
  "https://tor-salon-products.myshopify.com/admin/api/2022-07/graphql.json" as string,
  {
    headers: {
      "X-Shopify-Access-Token": process.env
        .SHOPIFY_ADMIN_API_PASSWORD as string,
    },
  }
);