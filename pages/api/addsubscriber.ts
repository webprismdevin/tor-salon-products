import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const { email } = JSON.parse(req.body);

    console.log(email)

    const response = await fetch("https://us18.api.mailchimp.com/3.0/lists/d825e3184f/members", {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${process.env.MC_API_KEY}`
        },
        body: JSON.stringify({
            email_address: email,
            status: "subscribed"
        })
    }).then(res => res.json())

    if(response.error){
        res.send({
            data: false
        })
        
        throw(response.error)
    }

    res.send({
        data: true
    })

}