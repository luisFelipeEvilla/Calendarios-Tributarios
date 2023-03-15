import axios from "axios";

export default async function handler(req: any, res: any) {
  const { id, idImpuesto } = req.query;

  switch (req.method) {
    case 'DELETE':
      try {

          const url = `${process.env.API_URL}/cliente/${id}/impuesto/${idImpuesto}`;

          const response = await axios.delete(url);

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
