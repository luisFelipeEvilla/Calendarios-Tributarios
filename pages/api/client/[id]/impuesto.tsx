import axios from "axios";

export default async function handler(req: any, res: any) {
  const { id } = req.query;

  switch (req.method) {
    case 'POST':
      try {
          const url = `${process.env.API_URL}/cliente/${id}/impuesto`;

          const response = await axios.post(url, req.body);

          console.log(response.data)
          res.status(200).json(response.data);
      }
      catch (error: any) {
        console.log(error);
        return res.status(500).json(error);
      }
      break;

    default:
      break;
  }
}
