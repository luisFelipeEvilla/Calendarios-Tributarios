import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { createImpuesto, getImpuestos } from "../../../controllers/impuesto";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any |  Error>
) {
    
    switch (req.method) {
        case 'GET':
            try {
                const url = `${process.env.NEXT_PUBLIC_API_URL}/impuesto`
                
                const impuestos = (await axios.get(url)).data;
                
                res.status(200).json(impuestos);
            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
            break;
        case 'POST':
            try {
                const impuesto = await createImpuesto(req.body);
                res.status(200).json(impuesto);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        default:
            break;
    }
   
}