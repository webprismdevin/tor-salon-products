import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";

const endpoint = `https://graph.facebook.com/v18.0/711750850270833/events?access_token=${process.env.FB_CAPI_ACCESS_TOKEN}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const test_event_code = "TEST43390";

  if (req.method === "GET") {
    // Handle GET request

    console.log(endpoint);
    console.log(req.query);
    console.log(requestIp.getClientIp(req));

    if (req.query.handle === "PageView") {
      const pageViewBody = JSON.stringify({
        data: [
          {
            event_name: "PageView",
            event_time: new Date(Date.now()),
            event_source_url: `https://www.torsalonproducts.com${req.query.location}`,
            action_source: "website",
            user_data: {
              client_ip_address: requestIp.getClientIp(req),
              client_user_agent: req.headers["user-agent"],
            },
          },
        ],
        test_event_code: test_event_code ?? null,
      });

      console.log(pageViewBody);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: pageViewBody,
      });

      if (response.status === 200) {
        res.status(200).json({ message: "POST request received" });
      } else {
        res.status(500).json({ message: "POST request failed" });
      }
    }

    // res.status(200).json({ message: "GET request received" });
  } else if (req.method === "POST") {
    // Handle POST request
    res.status(200).json({ message: "POST request received" });
  } else {
    // Handle other HTTP methods
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
