// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  username: string,
  password: string
}

type Error = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {

  const { username, password } = req.body

  const url = `${process.env.API_URL}/login/empleado`;

  const body = { username, password }
  
  try {
    const request = await axios.post(url, body);

    const response = request.data;

    res.status(200).json(response);
  } catch (error) {    
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }

}
