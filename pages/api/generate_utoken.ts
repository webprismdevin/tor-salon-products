import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){

    const token = await fetch("https://api.yotpo.com/oauth/token", {
        method: "POST",
        body: JSON.stringify({
            grant_type: "client_credentials",
            client_id: process.env.NEXT_PUBLIC_YOTPO_APP_KEY,
            client_secret: process.env.YOTPO_CLIENT_SECRET
        })
    })

    res.send({
        token
    })
}