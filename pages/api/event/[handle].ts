import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";

const endpoint = `https://graph.facebook.com/v18.0/711750850270833/events?access_token=${process.env.FB_CAPI_ACCESS_TOKEN}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const test_event_code = "TEST43390";

  if (req.method === "GET") {
    // Handle GET request

    if (req.query.handle === "PageView") {
      const pageViewBody = JSON.stringify({
        data: [
          {
            event_id: req.query.event_id ?? null,
            event_name: "PageView",
            event_time: new Date(Date.now()),
            event_source_url: req.query.location,
            action_source: "website",
            user_data: {
              client_ip_address: requestIp.getClientIp(req),
              client_user_agent: req.headers["user-agent"],
              fbp: req.query.fbp ?? null,
              fbc: req.query.fbc ?? null,
            },
          },
        ],
        // test_event_code: test_event_code ?? null,
      });


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

    if (req.query.handle == "ViewContent") {
      const viewContentBody = JSON.stringify({
        data: [
          {
            event_id: req.query.event_id ?? null,
            event_name: "ViewContent",
            event_time: new Date(Date.now()),
            event_source_url: req.query.location,
            action_source: "website",
            user_data: {
              client_ip_address: requestIp.getClientIp(req),
              client_user_agent: req.headers["user-agent"],
              fbp: req.query.fbp ?? null,
              fbc: req.query.fbc ?? null,
            },
            custom_data: {
              content_name: req.query.content_name,
              content_category: req.query.content_category,
              content_ids: [req.query.content_ids],
              content_type: req.query.content_type,
              value: Number(req.query.value),
              currency: "USD",
            },
          },
        ],
        // test_event_code: test_event_code ?? null,
      });


      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: viewContentBody,
      });

      if (response.status === 200) {
        res.status(200).json({ message: "POST request received" });
      } else {
        res.status(500).json({ message: "POST request failed" });
      }
    }

    if (req.query.handle === "AddToCart") {
      const addToCartBody = JSON.stringify({
        data: [
          {
            event_id: req.query.event_id ?? null,
            event_name: "AddToCart",
            event_time: new Date(Date.now()),
            event_source_url: req.query.location,
            action_source: "website",
            user_data: {
              client_ip_address: requestIp.getClientIp(req),
              client_user_agent: req.headers["user-agent"],
              fbp: req.query.fbp ?? null,
              fbc: req.query.fbc ?? null,
            },
            custom_data: {
              content_name: req.query.content_name,
              content_category: req.query.content_category,
              content_ids: [req.query.content_ids],
              content_type: req.query.content_type,
              value: Number(req.query.value),
              currency: "USD",
            },
          },
        ],
        // test_event_code: test_event_code ?? null,
      });


      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: addToCartBody,
      });

      if (response.status === 200) {
        res.status(200).json({ message: "POST request received" });
      } else {
        res.status(500).json({ message: "POST request failed" });
      }
    }

  } else if (req.method === "POST") {
    // Handle POST request
    res.status(200).json({ message: "POST request received" });
  } else {
    // Handle other HTTP methods
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
