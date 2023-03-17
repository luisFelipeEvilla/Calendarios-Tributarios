import { Box } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TablaGestionImpuestos from "../../../components/cliente/tablaGestionImpuestos";
import Layout from "../../../components/layout";
import Spinner from "../../../components/layouts/spinner";
import CalendarioCliente from "../../../components/schedulers/calendarioCliente";

export default function GestionTributaria() {
    const [client, setClient] = useState<any>({} as any);
    const [clientTaxes, setClientTaxes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [taxes, setTaxes] = useState([]);

    const [impuestosTabla, setImpuestosTabla] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return

        getClient();
    }, [router.isReady])

    const handleClientTaxChange = (newClientTaxes: any[]) => {
        setClientTaxes(newClientTaxes);
    }

    const getClient = async () => {
        const { id } = router.query;

        const url = `/api/client/${id}`;
        try {
            const response = await axios.get(url);
            const cliente = response.data;
            setClient(cliente);

            const fechasPresentacion = cliente.impuestos.map((impuesto: any) => {
                const i = { id: impuesto.id, idImpuesto: impuesto.impuesto.id, nombre: impuesto.impuesto.nombre, cuotas: [] };

                i.cuotas = impuesto.cuotas.map((cuota: any) => {
                    cuota.fecha_limite = new Date(cuota.fecha_limite);
                    return { id: cuota.id, nombre: impuesto.impuesto.nombre, fecha: cuota.fecha_limite };
                });

                return i;
            });
            
            const impuestos: { id: any; nombre: any; fecha_limite: any; fecha_presentacion: any; fecha_pago: any; }[] = [];

            cliente.impuestos.forEach((impuesto: any) => {
                impuesto.cuotas.forEach((cuota: any) => {
                    cuota.fecha_limite = new Date(cuota.fecha_limite);
                    cuota.fecha_limite.setDate(cuota.fecha_limite.getDate() + 1);
                    impuestos.push({
                        id: cuota.id, nombre: impuesto.impuesto.nombre,
                        fecha_limite: cuota.fecha_limite,
                        fecha_presentacion: cuota.fecha_presentacion,
                        fecha_pago: cuota.fecha_pago
                    });
                })
            })

            setImpuestosTabla(impuestos);
            handleClientTaxChange(fechasPresentacion);
            const taxes = await axios.get('/api/tax');
            setTaxes(taxes.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }
    return (

        <Layout>
            <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center' }}>
                <h1>Gestion Tributaria</h1>

                {
                    loading ?
                        <Spinner />
                        :
                        <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center' }}>
                            <CalendarioCliente impuestosCliente={clientTaxes} />
                            <TablaGestionImpuestos impuestos={impuestosTabla} />
                        </Box>
                }
            </Box>
        </Layout>
    )
}