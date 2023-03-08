import { NextApiRequest, NextApiResponse } from "next";
import { getMunicipios } from "../../../controllers/municipio";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any |  Error>
) {
    
    switch (req.method) {
        case 'GET':
            try {
                const municipalities = await getMunicipios();

                res.status(200).json(municipalities);
            } catch (error) {
                res.status(500).json(error);
            }
            break;
    
        default:
            break;
    }
   
}