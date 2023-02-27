import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any |  Error>
) {
    
    switch (req.method) {
        case 'GET':
            try {
                const taxes = await getTaxes();
    
                res.status(200).json(taxes.data);
            } catch (error) {
                res.status(500).json(error);
            }
            break;
    
        default:
            break;
    }
   
}

async function getTaxes() {
    const url = `${process.env.API_URL}/impuesto`;
    try {
        const response = await axios.get(url);

        return response.data;
    } catch (error) {
        console.log(error);
    }
}