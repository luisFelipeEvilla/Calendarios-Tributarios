import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

type Request = NextApiRequest & { query: { id: number } };
export default async function handler(
    req: Request,
    res: NextApiResponse<boolean | Error>
) {
    const { id } = req.query;

    switch (req.method) {
        case 'GET':
            try {
                const client = await getClient(id);
                return res.status(200).json(client);
            } catch (error: any) {
                return res.status(500).json(error);
            }
            break;
        default:
            break;
    }
}

async function getClient(id: number) {
    const url = `${process.env.API_URL}/cliente/${id}`;
    const response = await axios.get(url);
    return response.data.data;
}