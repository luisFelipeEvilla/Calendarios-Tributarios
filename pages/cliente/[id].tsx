
import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, Box, Button, FormControl, Grid, Input, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import Layout from "../../components/layout";
import Spinner from "../../components/layouts/spinner";
import MessageModal from "../../components/messageModal";
import CalendarioCliente from "../../components/schedulers/calendarioCliente";


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
    // get id from url
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return

        getClient();
    }, [router.isReady])

    useEffect(() => {
        const filtered = taxes.filter((tax: any) => tax.persona == client.tipo_persona || tax.persona == 0);
        setFilteredTaxes(filtered);
    }, [taxes, client.tipo_persona])

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
                    return { fecha: cuota.fecha_limite };
                });

                return i;
            });

            handleClientTaxChange(fechasPresentacion);
            const taxes = await axios.get('/api/tax');
            setTaxes(taxes.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }


    const handleNitChange = (e: any) => {
        const nit = parseInt(e.target.value);
        setClient({ ...client, nit });
    }

    const handleNombreEmpresaChange = (e: any) => {
        setClient({ ...client, nombre_empresa: e.target.value });
    }

    const handlePaginaWebChange = (e: any) => {
        setClient({ ...client, pagina_web: e.target.value });
    }

    const handleClientTaxChange = (newClientTaxes: any[]) => {
        setClientTaxes(newClientTaxes);
    }

    const handleAddTax = async (e: any) => {
        e.preventDefault();

        // find it tax has been added
        const taxOnclient = clientTaxes.find((tax) => tax.idImpuesto === parseInt(e.target[0].value));

        if (taxOnclient) {
            setModalOpen(true);
            setModalMessage('El impuesto ya ha sido agregado');
            setError(true);
            return;
        }

        const taxId = parseInt(e.target[0].value);
        const tax = taxes.find((tax: any) => tax.id === taxId) || {} as any;

        const cuotas = tax.cuotas.map((cuota: any) => {
            const fechaPresentacion = cuota.fechas_presentacion.filter((fecha: any) => {
                const nit = client.nit.toString();
                const digitosDeAsignacion = tax.numero_digitos;

                if (fecha.nit == nit.slice(nit.length - digitosDeAsignacion)) {
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

    const handleTipoPersonaChange = (e: any) => {
        setClient({ ...client, tipo_persona: e.target.value });
    }

    const handleUpdateClient = async (e: any) => {
        e.preventDefault();

        try {
            const url = `/api/client/${client.id}`;

            const response = await axios.put(url, client);

            setModalOpen(true);
            setModalMessage('Cliente actualizado correctamente');
            setError(false);
        } catch (error) {
            console.log(error);
            setModalOpen(true);
            setModalMessage('Error al actualizar el cliente');
            setError(true);
        }
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
                        <Grid container spacing={0} maxWidth={1000} marginTop={5}>
                            <Grid item md={6}>
                                <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant='h4'>Información General</Typography>
                                    {formInput('Nombre de la empresa', client.nombre_empresa, handleNombreEmpresaChange)}
                                    {formInput('NIT', client.nit, handleNitChange)}
                                    {formInput('Página web', client.pagina_web, handlePaginaWebChange)}
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant='h4'>Información Tributaria</Typography>
                                    <FormControl sx={{ width: 300, marginTop: 3 }}>
                                        <InputLabel htmlFor="nit">Tipo de Persona</InputLabel>
                                        <Select value={client.tipo_persona} onChange={handleTipoPersonaChange} name="Tipo de persona" label="Tipo de persona">
                                            <MenuItem value={0}>Seleccione un tipo de persona</MenuItem>
                                            <MenuItem value={1}>Persona Natural</MenuItem>
                                            <MenuItem value={2}>Persona Jurídica</MenuItem>
                                            <MenuItem value={3}>Gran Contribuyente</MenuItem>
                                            <MenuItem value={4}>Régimen Simple de Tributación</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>

                            <Grid item md={12} >
                                <Box className='container' sx={{ justifyContent: 'center', marginTop: 5 }}>
                                    <Button variant='contained' color='success' onClick={handleUpdateClient}>Actualizar</Button>
                                </Box>
                            </Grid>
                        </Grid>

                        <CalendarioCliente impuestos={filteredTaxes} impuestosCliente={clientTaxes} handleAddTax={handleAddTax} handleDeleteTax={handleDeleteTax} />
                    </Box>
            }
        </Layout>
    )
}

function formInput(label: string, value: any, setValue: SetStateAction<any>) {
    return (
        <FormControl sx={{ width: 300, marginTop: 3 }}>
            <InputLabel htmlFor="nit">{label}</InputLabel>
            <Input id="nit" value={value} onChange={(e) => setValue(e)} />
        </FormControl>
    )
}

