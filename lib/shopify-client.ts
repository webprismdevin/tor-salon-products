import { createStorefrontClient } from "@shopify/hydrogen-react";

const client = createStorefrontClient({
    privateStorefrontToken: process.env.SHOPIFY_STOREFRONT_TOKEN!,
    storeDomain: 'tor-salon-products.myshopify.com',
    storefrontApiVersion: process.env.SHOPIFY_API_VERSION!,
  });
  export const getStorefrontApiUrl = client.getStorefrontApiUrl;
  export const getPrivateTokenHeaders = client.getPrivateTokenHeaders;