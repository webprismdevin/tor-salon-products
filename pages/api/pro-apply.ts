// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  response?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const Recipient = require("mailersend").Recipient;
  const EmailParams = require("mailersend").EmailParams;
  const MailerSend = require("mailersend");

  const data = JSON.parse(req.body);

  const emailText = `You got an email from ${data.first_name} ${data.last_name}!
  ---
  Name: ${data.first_name} ${data.last_name}
  Phone: ${data.phone}
  Email: ${data.email}
  ---
  How did you hear about TOR: ${data.howDidYouHear}`;

  const mailersend = new MailerSend({
    api_key: process.env.MAILERSEND_TOKEN,
  });

  console.log(emailText);

  const response = await fetch(
    "https://us18.api.mailchimp.com/3.0/lists/d825e3184f/members",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.MC_API_KEY}`,
      },
      body: JSON.stringify({
        email_address: data.email,
        merge_fields: {
          FNAME: data.first_name,
          LNAME: data.last_name
        },
        tags: ["Professional"],
        status: "subscribed",
      }),
    }
  ).then((res) => res.json());

  if (response.error) {
    throw response.error;
  }

  const recipients =
    process.env.NODE_ENV === "production"
      ? [
          new Recipient("team@webprism.co", "WEBPRISM Team"),
          new Recipient("info@torsalonproducts.com", "TOR Team"),
        ]
      : [new Recipient("devin@webprism.co", "Devin Santamaria")];

  const emailParams = new EmailParams()
    .setFrom("website-forms@webprism.co")
    .setFromName("torsalonproducts.com")
    .setRecipients(recipients)
    .setSubject("🎉 New Salon Pro Form Submission on torsalonproducts.com 🚀")
    .setText(emailText);

  mailersend
    .send(emailParams)
    .then((result: any) => {
      if (result.status === 202)
        res.status(200).json({ response: "We sent the email" });
    })
    .catch((error: any) => {
      if (error)
        res.status(500).json({ error: "there was an error, check the logs." });
    });

  //testing
  // res.status(200).json({ response: "We sent the email" });
}
