import { Box } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TablaGestionImpuestos from "../../../../components/cliente/tablaGestionImpuestos";
import Layout from "../../../../components/layout";
import Spinner from "../../../../components/layouts/spinner";
import CalendarioCliente from "../../../../components/schedulers/calendarioCliente";
import { getFechaConLocale } from "../../../../utils";

export default function GestionTributaria() {
    const [client, setClient] = useState<any>({} as any);
    const [clientTaxes, setClientTaxes] = useState<any[]>([]); // para el calendario
    const [loading, setLoading] = useState<boolean>(true); // para la tabla

    const [impuestosTabla, setImpuestosTabla] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return

        getClient();
    }, [router.isReady])

    const getClient = async () => {
        const { id } = router.query;

        const url = `/api/client/${id}`;
        try {
            const response = await axios.get(url);
            const cliente = response.data;
            setClient(cliente);

            const fechasPresentacion = cliente.impuestos.map((impuesto: any) => {
                const i = { id: impuesto.id, idImpuesto: impuesto.impuesto.id, tipo: impuesto.impuesto.tipo, nombre: impuesto.impuesto.nombre, cuotas: [] };
                i.cuotas = impuesto.cuotas.map((cuota: any) => {
                    cuota.fecha_limite = new Date(cuota.fecha_limite);
                    return { id: cuota.id, nombre: impuesto.impuesto.nombre, fecha: cuota.fecha_limite };
                });

                return i;
            });
            
            const impuestos: { id: any; nombre: any; fecha_limite: any; fecha_presentacion: any; fecha_pago: any; }[] = [];

            cliente.impuestos.forEach((impuesto: any) => {
                impuesto.cuotas.forEach((cuota: any) => {
                    if (cuota.fecha_presentacion) cuota.fecha_presentacion = getFechaConLocale(cuota.fecha_presentacion);
                    if (cuota.fecha_pago) cuota.fecha_pago = getFechaConLocale(cuota.fecha_pago);
                    impuestos.push({
                        id: cuota.id, nombre: impuesto.impuesto.nombre,
                        fecha_limite: getFechaConLocale(cuota.fecha_limite),
                        fecha_presentacion: cuota.fecha_presentacion,
                        fecha_pago: cuota.fecha_pago
                    });
                })
            })

            setImpuestosTabla(impuestos);
            setClientTaxes(fechasPresentacion);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    return (

        <Layout>
            <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center' }}>
                <h1>Gestión Tributaria</h1>

                {
                    loading ?
                        <Spinner />
                        :
                        <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
                            <CalendarioCliente impuestosCliente={clientTaxes} />
                            <TablaGestionImpuestos idCliente={router.query.id} impuestos={impuestosTabla} />
                        </Box>
                }
            </Box>
        </Layout>
    )
}