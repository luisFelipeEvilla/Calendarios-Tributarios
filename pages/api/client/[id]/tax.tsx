import axios from "axios";

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  switch (req.method) {
    case 'POST':
      try {
          console.log(req.body);

          const url = `${process.env.API_URL}/cliente/${id}/impuesto`;

          const response = await axios.post(url, req.body);

          return req.body;
      }
      catch (error: any) {
        return res.status(500).json(error);
      }
      break;

    default:
      break;
  }
}
