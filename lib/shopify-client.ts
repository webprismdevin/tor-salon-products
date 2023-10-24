import { createStorefrontClient } from "@shopify/hydrogen-react";
import { GraphQLClient } from "graphql-request";

const client = createStorefrontClient({
  privateStorefrontToken: process.env.SHOPIFY_PAS,
  storeDomain: "https://tor-salon-products.myshopify.com",
  storefrontApiVersion: process.env.NEXT_PUBLIC_SHOPIFY_API_VER,
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
