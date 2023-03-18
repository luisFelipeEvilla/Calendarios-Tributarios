import axios from "axios";

export default async function handler(req: any, res: any) {
  const { id, idImpuestoCliente } = req.query;

  console.log(req.method)
  switch (req.method) {
    case 'GET':
      return res.status(200).json({ id, idImpuestoCliente });
    break;
    case 'PUT':
      try {
          const url = `${process.env.API_URL}/cliente/${id}/impuesto/${idImpuestoCliente}`;

          console.log(req.body);
          const response = await axios.put(url, req.body);

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
