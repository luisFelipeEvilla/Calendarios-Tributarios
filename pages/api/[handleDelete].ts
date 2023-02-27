import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<boolean | Error>
) {
    const { id } = req.query;

    console.log(id);
    
    
}