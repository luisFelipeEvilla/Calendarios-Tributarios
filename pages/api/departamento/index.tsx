import { NextApiRequest, NextApiResponse } from "next";
import { getDepartamentos } from "../../../controllers/departamento";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any |  Error>
) {
    
    switch (req.method) {
        case 'GET':
            try {
                const departments = await getDepartamentos();

                res.status(200).json(departments);
            } catch (error) {
                res.status(500).json(error);
            }
            break;
    
        default:
            break;
    }
   
}