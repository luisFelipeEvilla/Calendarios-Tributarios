import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any |  Error>
) {
    
    switch (req.method) {
        case 'GET':
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}/municipio`
                const municipalities = (await axios.get(url)).data;

                res.status(200).json(municipalities);
            } catch (error) {
                res.status(500).json(error);
            }
            break;
    
        default:
            break;
    }
   
}