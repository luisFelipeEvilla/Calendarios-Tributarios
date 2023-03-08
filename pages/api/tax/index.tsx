import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getImpuestos } from "../../../controllers/impuesto";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any |  Error>
) {
    
    switch (req.method) {
        case 'GET':
            try {
                const taxes = await getImpuestos();

                res.status(200).json(taxes);
            } catch (error) {
                res.status(500).json(error);
            }
            break;
    
        default:
            break;
    }
   
}