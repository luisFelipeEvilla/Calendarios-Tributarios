import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<boolean | Error>
) {
    const { id } = req.query;

    const url = `${process.env.API_URL}/impuesto/${id}`;

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
}