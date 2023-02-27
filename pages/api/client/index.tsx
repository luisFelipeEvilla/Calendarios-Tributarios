import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<boolean | Error>
) {
    const url = `${process.env.API_URL}/cliente`;

    switch (req.method) {
        case 'GET':
            try {
                const clients = await getClients();
                return res.status(200).json(clients);
            } catch (error: any) {
                return res.status(500).json(error);
            }
            break;
        default:
            break;
    }
}

async function getClients() {
    const url = `${process.env.API_URL}/cliente`;
    const response = await axios.get(url);
    return response.data.data;
}