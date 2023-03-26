
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { getFechaConLocale } from "../../../../utils";


const InvoicePDF = dynamic(() => import("../../../../components/cliente/pdf"), {
    ssr: false,
});


const View = () => {
    const [client, setClient] = useState<any>({} as any);
    const [clientTaxes, setClientTaxes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [taxes, setTaxes] = useState([]);

    const [impuestosTabla, setImpuestosTabla] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        getClient();
    }, [router.isReady]);

    const handleClientTaxChange = (newClientTaxes: any[]) => {
        setClientTaxes(newClientTaxes);
    }

    const getClient = async () => {
        const { id } = router.query;

        const url = `/api/client/${id}`;
        try {
            const response = await axios.get(url);
            const cliente = response.data;
            console.log(cliente);
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
            handleClientTaxChange(fechasPresentacion);
            const taxes = await axios.get('/api/tax');
            setTaxes(taxes.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <InvoicePDF cliente={client} />
    )
}

export default View