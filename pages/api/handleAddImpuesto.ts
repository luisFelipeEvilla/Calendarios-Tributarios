import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { name, applyTo, period, taxType, feeds, departamento, municipio } = req.body;

    const url = `${process.env.API_URL}/impuesto`;
    const body = { name, applyTo, period, taxType, feeds, departamento, municipio }    

    // todo add x-csrf-token header to the request
    const headers = { 'X-CSRF-TOKEN': '3glwR2O4PSDGxvbB4X1lv9sdZO5BE7QjAo1o7SpX'}
    try {
        const request = await axios.post(url, body, { headers});

        const response = request.data;

        return res.status(200).json(response.data);
    } catch(error) {
        return res.status(500).json({message: error})
    }
}