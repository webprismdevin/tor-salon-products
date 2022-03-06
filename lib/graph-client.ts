import { GraphQLClient } from "graphql-request"

const graphClient = new GraphQLClient(process.env.NEXT_PUBLIC_SHOPIFY_URL as string, {
    headers: {
      "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_TOKEN as string,
    },
})

export default graphClient