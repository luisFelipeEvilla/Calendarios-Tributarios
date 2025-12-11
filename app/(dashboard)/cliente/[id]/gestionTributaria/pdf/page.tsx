"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getFechaConLocale } from "../../../../../../utils";
import { Loader2 } from "lucide-react";

const InvoicePDF = dynamic(
  () => import("../../../../../../components/cliente/pdf"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    ),
  }
);

const View = () => {
  const [client, setClient] = useState<any>({} as any);
  const [clientTaxes, setClientTaxes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [taxes, setTaxes] = useState([]);

  const [impuestosTabla, setImpuestosTabla] = useState<any[]>([]);
  const params = useParams();
  const searchParams = useSearchParams();
  const vigencia =
    searchParams.get("vigencia") || new Date().getFullYear().toString();

  useEffect(() => {
    getClient();
  }, [vigencia]);

  const handleClientTaxChange = (newClientTaxes: any[]) => {
    setClientTaxes(newClientTaxes);
  };

  const getClient = async () => {
    const { id } = params;

    const url = `/api/client/${id}`;
    try {
      const response = await axios.get(url);
      const cliente = response.data;
      setClient(cliente);

      const fechasPresentacion = cliente.impuestos.map((impuesto: any) => {
        const i = {
          id: impuesto.id,
          idImpuesto: impuesto.impuesto.id,
          tipo: impuesto.impuesto.tipo,
          nombre: impuesto.impuesto.nombre,
          cuotas: [],
        };
        i.cuotas = impuesto.cuotas.map((cuota: any) => {
          cuota.fecha_limite = new Date(cuota.fecha_limite);
          return {
            id: cuota.id,
            nombre: impuesto.impuesto.nombre,
            fecha: cuota.fecha_limite,
          };
        });

        return i;
      });

      const impuestos: {
        id: any;
        frecuencia: number;
        vigencia: string;
        nombre: any;
        fecha_limite: any;
        fecha_presentacion: any;
        fecha_pago: any;
      }[] = [];

      cliente.impuestos.forEach((impuesto: any) => {
        impuesto.cuotas.forEach((cuota: any, index: number) => {
          if (cuota.fecha_presentacion)
            cuota.fecha_presentacion = getFechaConLocale(
              cuota.fecha_presentacion
            );
          if (cuota.fecha_pago)
            cuota.fecha_pago = getFechaConLocale(cuota.fecha_pago);
          impuestos.push({
            id: cuota.id,
            nombre: impuesto.impuesto.nombre,
            frecuencia: impuesto.impuesto.frecuencia,
            fecha_limite: getFechaConLocale(cuota.fecha_limite),
            vigencia: `${impuesto.impuesto.vigencia} - ${index + 1}`,
            fecha_presentacion: cuota.fecha_presentacion,
            fecha_pago: cuota.fecha_pago,
          });
        });
      });

      // ordenar impuesto por fecha limite
      impuestos.sort((a, b) => {
        if (a.fecha_limite > b.fecha_limite) return 1;
        if (a.fecha_limite < b.fecha_limite) return -1;
        return 0;
      });

      setImpuestosTabla(impuestos);
      handleClientTaxChange(fechasPresentacion);
      const taxes = await axios.get(`/api/tax?vigencia=${vigencia}`);
      setTaxes(taxes.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <InvoicePDF cliente={client} impuestos={impuestosTabla} />;
};

export default View;
