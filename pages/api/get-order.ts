import { gql, GraphQLClient } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const query = gql`
    {
        order(id: "${req.query.orderId}") {
            displayAddress {
                name
                firstName
                address1
                address2
                city
                province
                zip
                country
            }
            billingAddressMatchesShippingAddress
            billingAddress{
                name
                firstName
                address1
                address2
                city
                province
                zip
                country
            }
            email
            note
            lineItems(first: 100) {
              edges {
                node {
                  currentQuantity
                  discountedTotalSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  discountAllocations {
                    allocatedAmountSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                    }
                  }
                  originalTotalSet {
                    presentmentMoney {
                      amount
                      currencyCode
                    }
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  id
                  image {
                    url
                  }
                  name
                  currentQuantity
                }
              }
            }
            shippingLines(first: 100) {
							edges {
								node{
									id
                  code
                  requestedFulfillmentService {
										id
                    type
                    callbackUrl
                  }
                }
              }
            }
            currencyCode
            currentSubtotalPriceSet {
                shopMoney {
                    amount
                }
            }
            currentTotalTaxSet {
                shopMoney {
                    amount
                }
            }
            currentTotalPriceSet {
                shopMoney {
                    amount
                }
            }
            totalShippingPriceSet {
							shopMoney {
								amount
              }
            }
        }
      }
    `;

  const adminGraphClient = new GraphQLClient(
    "https://tor-salon-products.myshopify.com/admin/api/2022-07/graphql.json" as string,
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_PASSWORD as string,
      },
    }
  );

  const response = await adminGraphClient.request(query);

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));
    res.send({
      error: response.errors,
    });
    throw Error("There was a problem creating the cart. Please check logs");
  }
  res.send({
    response: response,
  });
}
