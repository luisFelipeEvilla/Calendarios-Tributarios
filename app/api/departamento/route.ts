import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any |  Error>
) {
    
    switch (req.method) {
        case 'GET':
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}/departamento`
                const departments = (await axios.get(url)).data;

                res.status(200).json(departments);
            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
            break;
    
        default:
            break;
    }
   
}