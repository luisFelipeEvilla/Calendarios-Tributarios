import { NextApiRequest, NextApiResponse } from "next";
import { getImpuesto, updateImpuesto } from "../../../controllers/impuesto";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    const url = `${process.env.API_URL}/impuesto/${id}`;

    switch (req.method) {
        case "GET":
            try {
                const impuesto = await getImpuesto(Number(id));
                if (impuesto != null) return res.status(200).json(impuesto) 
                
                return res.status(404).json(false);
            } catch (error: any) {
                res.status(500).json(error);
            }
            break;
        case "PUT":	
            try {
                const { ...impuesto } = req.body;

                const impuestoActualizado = await updateImpuesto(impuesto);
                
                if (impuestoActualizado != null) return res.status(200).json(impuestoActualizado)

                return res.status(404).json(false);
            } catch (error: any) {
                console.log(error)
                res.status(500).json(error);
            }
        case "DELETE":
            try {
                const request = await fetch(url, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                const response = await request.json();
    
                res.status(200).json(response);
            } catch (error: any) {
                res.status(500).json(error);
            }
            break;
    
        default:
            break;
    }
}