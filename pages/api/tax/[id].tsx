import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteImpuesto, getImpuesto, updateImpuesto } from "../../../controllers/impuesto";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    const url = `${process.env.API_URL}/impuesto/${id}`;

    switch (req.method) {
        case "GET":
            try {
                const url = `${process.env.API_URL}/impuesto/${id}`;
                const impuesto = (await axios.get(url)).data;
                if (impuesto != null) return res.status(200).json(impuesto) 
                
                return res.status(404).json(false);
            } catch (error: any) {
                res.status(500).json(error);
            }
            break;
        case "PUT":	
            try {
                const { ...impuesto } = req.body;
                const url = `${process.env.API_URL}/impuesto/${id}`;

                const response = await axios.put(url, impuesto);
                const impuestoActualizado = response.data;
                
                console.log(impuestoActualizado)
                if (impuestoActualizado != null) return res.status(200).json(impuestoActualizado)

                return res.status(404).json(false);
            } catch (error: any) {
                console.log(error)
                res.status(500).json(error);
            }
        case "DELETE":
            try {
                const url = `${process.env.API_URL}/impuesto/${id}`;
                const response = await axios.delete(url);
                const deleted = response.data;
                if (deleted != null) return res.status(200).json(deleted)

                return res.status(404).json(false);
            } catch (error: any) {
                res.status(500).json(error);
            }
            break;
    
        default:
            break;
    }
}