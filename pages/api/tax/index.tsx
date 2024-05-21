import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any |  Error>
) {
    
    switch (req.method) {
        case 'GET':
            try {
                // get query params
                const { vigencia } = req.query;

                const url = `${process.env.API_URL}/impuesto?vigencia=${vigencia}`

                console.log(url);

                const impuestos = (await axios.get(url)).data;
                
                res.status(200).json(impuestos);
            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
            break;
        case 'POST':
            try {
                const url = `${process.env.API_URL}/impuesto`
                const response = await axios.post(url, req.body);
                
                res.status(200).json(response.data);
            } catch (error) {
                console.error(error);
                res.status(500).json(error);
            }
        default:
            break;
    }
   
}