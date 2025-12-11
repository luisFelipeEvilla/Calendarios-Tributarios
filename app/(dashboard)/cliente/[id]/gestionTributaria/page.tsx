"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TablaGestionImpuestos from "@/components/cliente/tablaGestionImpuestos";
import Layout from "@/components/layout";
import CalendarioCliente from "@/components/schedulers/calendarioCliente";
import { getFechaConLocale } from "@/utils";
import { Loader2 } from "lucide-react";

export default function GestionTributaria() {
  const params = useParams();
  const [client, setClient] = useState<any>({} as any);
  const [clientTaxes, setClientTaxes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [impuestosTabla, setImpuestosTabla] = useState<any[]>([]);

  useEffect(() => {
    if (!params?.id) return;
    getClient();
  }, [params?.id]);

  const getClient = async () => {
    const url = `/api/client/${params.id}`;
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
          cuotas: [] as any[],
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
        nombre: any;
        fecha_limite: any;
        fecha_presentacion: any;
        fecha_pago: any;
      }[] = [];

      cliente.impuestos.forEach((impuesto: any) => {
        impuesto.cuotas.forEach((cuota: any) => {
          if (cuota.fecha_presentacion)
            cuota.fecha_presentacion = getFechaConLocale(cuota.fecha_presentacion);
          if (cuota.fecha_pago)
            cuota.fecha_pago = getFechaConLocale(cuota.fecha_pago);
          impuestos.push({
            id: cuota.id,
            nombre: impuesto.impuesto.nombre,
            fecha_limite: getFechaConLocale(cuota.fecha_limite),
            fecha_presentacion: cuota.fecha_presentacion,
            fecha_pago: cuota.fecha_pago,
          });
        });
      });

      setImpuestosTabla(impuestos);
      setClientTaxes(fechasPresentacion);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center p-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Gestión Tributaria
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col items-center w-full space-y-6 mb-8">
            <CalendarioCliente impuestosCliente={clientTaxes} />
            <TablaGestionImpuestos
              idCliente={params.id}
              impuestos={impuestosTabla}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}
