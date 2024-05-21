
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, Box, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../../../components/layout";
import FormularioCliente from '../../../components/layouts/cliente/formulario';
import Spinner from "../../../components/layouts/spinner";
import MessageModal from "../../../components/messageModal";
import CalendarioCliente from "../../../components/schedulers/calendarioCliente";
import ImpuestosCliente from "../../../components/taxes/ImpuestosCliente";
import { FiltersContext } from '../../../contexts/FiltersContext';


type Client = { id: number, nit: number, nombre_empresa: string, pagina_web: string, emails: string, nombre_representante_legal: string, prefijo_empresa: string, tipo_persona: number, telefono: string, direccion: string, fecha_creacion: string, fecha_modificacion: string, fecha_eliminacion: number };
type ImpuestoCliente = { nombre: string, cuotas: { fecha_limite: Date }[] };

export default function Client() {
    const [loading, setLoading] = useState<boolean>(true);
    const [client, setClient] = useState<Client>({} as Client);
    const [clientTaxes, setClientTaxes] = useState<any[]>([]);

    const [taxes, setTaxes] = useState([]);
    const [filteredTaxes, setFilteredTaxes] = useState<any[]>([]);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalMeessage, setModalMessage] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const { year } = useContext(FiltersContext);
    // get id from url
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return

        getClient();
    }, [router.isReady])

    useEffect(() => {
        getTaxes();
    }, [year])

    useEffect(() => {
        const filtered = taxes.filter((tax: any) => tax.persona == client.tipo_persona || tax.persona == 0);
        setFilteredTaxes(filtered);
    }, [taxes, client.tipo_persona])

    async function getTaxes() {
        const taxes = await axios.get('/api/tax', {
            params: {
                vigencia: year
            }
        });

        taxes.data.sort((a: any, b: any) => {
            if (a.nombre < b.nombre) {
                return -1;
            }
            if (a.nombre > b.nombre) {
                return 1;
            }
            return 0;
        });

        setTaxes(taxes.data);
    }

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
                    return { fecha: cuota.fecha_limite };
                });

                return i;
            });

            // ordenar impuestos por nombre
            fechasPresentacion.sort((a: any, b: any) => {
                if (a.nombre < b.nombre) {
                    return -1;
                }
                if (a.nombre > b.nombre) {
                    return 1;
                }
                return 0;
            });

            handleClientTaxChange(fechasPresentacion);

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClientTaxChange = (newClientTaxes: any[]) => {
        setClientTaxes(newClientTaxes);
    }

    const handleAddTax = async (e: any) => {
        e.preventDefault();

        const taxId = parseInt(e.target['impuesto'].value);

        // find it tax has been added
        const taxOnclient = clientTaxes.find((tax) => tax.idImpuesto === taxId);

        if (taxOnclient) {
            setModalOpen(true);
            setModalMessage('El impuesto ya ha sido agregado');
            setError(true);
            return;
        }

        const tax = taxes.find((tax: any) => tax.id == taxId) || {} as any;
        const cuotas = tax.cuotas.map((cuota: any) => {
            const fechaPresentacion = cuota.fechas_presentacion.filter((fecha: any) => {
                const nit = client.nit.toString();
                const digitosDeAsignacion = tax.numero_digitos;

                fecha.nit = parseInt(fecha.nit);
                const digitosDeVerificacion = parseInt(nit.slice(nit.length - digitosDeAsignacion));

                if (fecha.nit == digitosDeVerificacion) {
                    return fecha;
                }
            })

            return fechaPresentacion[0];
        })

        const nuevoImpuesto = {
            id: tax.id,
            cuotas
        }

        const url = `/api/client/${client.id}/impuesto`;

        const response = await axios.post(url, nuevoImpuesto);

        const newClientTaxes = [...clientTaxes];

        newClientTaxes.push({
            id: response.data.id,
            idImpuesto: tax.id,
            tipo: tax.tipo,
            nombre: tax.nombre,
            cuotas
        });

        handleClientTaxChange(newClientTaxes);

        setModalOpen(true);
        setModalMessage('Impuesto agregado correctamente');
        setError(false);
    }

    const handleDeleteTax = async (taxId: number) => {
        const url = `/api/client/${client.id}/impuesto/${taxId}`;

        const response = await axios.delete(url);

        const newClientTaxes = clientTaxes.filter((tax) => tax.id !== taxId);
        handleClientTaxChange(newClientTaxes);

        setModalOpen(true);
        setModalMessage('Impuesto eliminado correctamente');
        setError(true);

    }

    return (
        <Layout>
            <Head>
                <title>Editar cliente</title>
            </Head>
            {
                loading ? <Spinner /> :
                    <Box className="container" justifyContent={'center'} flexDirection='column' alignItems={'center'} marginTop={5}>
                        <MessageModal modalOpen={modalOpen} setModalOpen={setModalOpen} title={modalMeessage} error={error} />
                        <Avatar sx={{ height: 200, width: 200, marginBottom: 5 }}>
                            <PeopleIcon sx={{ height: 140, width: 140 }} />
                        </Avatar>

                        <Typography variant='h3'>{client?.nombre_empresa}</Typography>


                        <FormularioCliente cliente={client} setCliente={setClient} setModalOpen={setModalOpen} setModalMessage={setModalMessage} setError={setError} />

                        <Box className='container' justifyContent={'center'} flexDirection='column' alignItems={'center'} marginTop={2}>
                            <CalendarioCliente impuestosCliente={clientTaxes} />
                            <ImpuestosCliente impuestos={filteredTaxes} impuestosCliente={clientTaxes} handleAddTax={handleAddTax} handleDeleteTax={handleDeleteTax} />
                        </Box>
                    </Box>
            }
        </Layout>
    )
}

