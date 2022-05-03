import type { NextApiRequest, NextApiResponse } from "next";
import crypto from 'node:crypto'

type Data = {
    data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

    const { email } = JSON.parse(req.body);

    console.log(email)

    const sub_hash = crypto.createHash('md5').update(email).digest("hex")

    const response = await fetch(`https://us18.api.mailchimp.com/3.0/lists/d825e3184f/members/${await sub_hash}?skip_merge_validation=true`, {
        method: 'PUT',
        headers: {
            'Authorization': `Basic ${process.env.MC_API_KEY}`
        },
        body: JSON.stringify({
            email_address: email,
            status: "subscribed",
            status_if_new: "subscribed"
        })
    }).then(res => res.json())

    if(response.error){
        res.send({
            data: {
                success: false,
                response: response.error
            }
        })
        
        throw(response.error)
    }

    res.send({
        data: {
            success: true,
            response: response
        }
    })

}