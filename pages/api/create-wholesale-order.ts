import { gql, GraphQLClient } from "graphql-request";
import type { NextApiRequest, NextApiResponse } from "next";
const Recipient = require("mailersend").Recipient;
const EmailParams = require("mailersend").EmailParams;
const MailerSend = require("mailersend");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_TOKEN,
  });

  const query = gql`
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const adminGraphClient = new GraphQLClient(
    "https://tor-salon-products.myshopify.com/admin/api/2022-01/graphql.json" as string,
    {
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_API_PASSWORD as string,
      },
    }
  );

  const data = JSON.parse(req.body);

  const lineItems = data.lineItems.map((line: any) => ({
    appliedDiscount: {
      value: 50,
      valueType: "PERCENTAGE",
    },
    variantId: line.node.merchandise.id,
    quantity: line.node.quantity,
  }));

  const variables = {
    lineItems,
    customerId: data.customerId,
    email: data.email,
    shippingAddress: data.shippingAddress,
    billingAddress: data.billingAddress,
    note: data.note
  };

  const response = await adminGraphClient.request(query, {
    input: variables,
  });

  if (response.errors) {
    console.log(JSON.stringify(response.errors, null, 2));
    res.send({
      error: response.errors,
    });
    throw Error("There was a problem creating the order. Please check logs");
  }

  const draftOrderId = response.draftOrderCreate.draftOrder.id.split("/")[4];

  if (response) {
    const recipients = [
      new Recipient("devin@webprism.co", "Devin Santamaria"),
      // new Recipient("ttor@torsalonproducts.com", "Tina Tor"),
      // new Recipient("stor@torsalonproducts.com", "Shannon Tor"),
    ];

    const emailParams = new EmailParams()
      .setFrom("tor-wholesale@webprism.co")
      .setFromName("TOR Wholesale Notifications")
      .setRecipients(recipients)
      .setReplyTo("norepoly@webprism.co")
      .setReplyToName("[No Reply] WEBPRISM")
      .setSubject(`New wholesale order from ${data.email}`)
      .setHtml(
        `View the new order at https://tor-salon-products.myshopify.com/admin/draft_orders/${draftOrderId}`
      )
      .setText(
        `View the new order at https://tor-salon-products.myshopify.com/admin/draft_orders/${draftOrderId}`
      );

    mailersend
      .send(emailParams)
      .then((response: any) => response.json())
      .then((res: any) => console.log(res))
      .catch((err:any) => console.log(err))
  }

  res.send({
    response: response,
  });
}
