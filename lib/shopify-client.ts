import { createStorefrontClient } from "@shopify/hydrogen-react";

const client = createStorefrontClient({
    publicStorefrontToken: "a37e8b74cb52b6e0609c948c43bb0a5c",
    storeDomain: 'tor-salon-products.myshopify.com',
    storefrontApiVersion: process.env.SHOPIFY_API_VERSION!,
  });
  export const getStorefrontApiUrl = client.getStorefrontApiUrl;
  export const getPrivateTokenHeaders = client.getPrivateTokenHeaders;