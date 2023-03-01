
import { Avatar, Box, Button, Chip, FormControl, Grid, Input, InputLabel, MenuItem, Select, Table, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import Layout from "../../components/layout";
import PeopleIcon from '@mui/icons-material/People';
import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { es } from "date-fns/locale";
import TableBody from "@mui/material/TableBody/TableBody";


type Client = { id: number, nit: number, nombre_empresa: string, pagina_web: string, emails: string, nombre_representante_legal: string, prefijo_empresa: string };
export default function Client() {
    const [loading, setLoading] = useState<boolean>(true);
    const [client, setClient] = useState<Client>({} as Client);
    const [taxes, setTaxes] = useState([]);
    const [clientTaxes, setClientTaxes] = useState<any[]>([]);
    const [scheduledTax, setScheduledTax] = useState<ProcessedEvent[] | undefined>();
    // get id from url
    const router = useRouter();

    const { setEvents } = useScheduler();

    useEffect(() => {
        const getClient = async () => {
            const { id } = router.query;

            const url = `/api/client/${id}`;
            try {
                const response = await axios.get(url);
                setClient(response.data);

                const taxes = await axios.get('/api/tax');
                setTaxes(taxes.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getClient();
    }, [])

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

    const handlePrefijoEmpresaChange = (e: any) => {
        setClient({ ...client, prefijo_empresa: e.target.value });
    }

    const handleAddTax = (e: any) => {
        e.preventDefault();

        const taxId = parseInt(e.target[0].value);
        const tax = taxes.find((tax: any) => tax.id === taxId) || {} as any;

        const cuotas = tax.cuotas.map((cuota: any) => {
            const fechaPresentacion = cuota.fechas.filter((fecha: any) => {
                const nit = client.nit.toString();
                if (fecha.nit == nit.charAt(nit.length - 1)) {
                    return fecha;
                }
            })

            return fechaPresentacion[0];
        })

        const newClientTaxes = clientTaxes;

        newClientTaxes.push({
            id: tax.id,
            nombre: tax.nombre,
            cuotas
        });

        setClientTaxes(newClientTaxes);

        const events: ProcessedEvent[] = [];

        newClientTaxes.forEach((tax, index) => {
            tax.cuotas.forEach((cuota: any) => {
                const startDate = new Date(cuota.fecha);
                startDate.setDate(startDate.getDate() + 1);
                events.push({
                    event_id: index,
                    title: tax.nombre,
                    start: startDate,
                    end: startDate,
                    color: '#3f51b5',
                    textColor: '#fff',
                    allDay: true,
                })
            });
        })
        setEvents(events);
    }

    const handleDeleteTax = (taxId: number) => {
        const newClientTaxes = clientTaxes.filter((tax) => tax.id !== taxId);
        setClientTaxes(newClientTaxes);
    }

    return (
        <Layout>
            <Head>
                <title>Editar cliente</title>
            </Head>
            {
                loading ? <h1>Cargando...</h1> :
                    <Box className="container" justifyContent={'center'} flexDirection='column' alignItems={'center'} marginTop={5}>
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
                                    {formInput('Prefijo De Empresa', client.prefijo_empresa, handlePrefijoEmpresaChange)}
                                </Box>
                            </Grid>
                            <Grid item md={6}>
                                <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant='h4'>Información Tributaria</Typography>
                                    <FormControl sx={{ width: 300, marginTop: 3 }}>
                                        <InputLabel htmlFor="nit">Tipo de Persona</InputLabel>
                                        <Select name="Tipo de persona" label="Tipo de persona">
                                            <MenuItem value={1}>Persona Natural</MenuItem>
                                            <MenuItem value={2}>Persona Jurídica</MenuItem>
                                            <MenuItem value={2}>Gran Contribuyente</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>

                        <Box className='container' justifyContent={'center'} flexDirection='column' alignItems={'center'} marginTop={5}>
                            <Typography variant='h4'>Calendario Tributario</Typography>

                            <Box width={800} marginTop={5} marginBottom={5}>
                                <Scheduler events={scheduledTax || []} locale={es} view="month"></Scheduler>
                            </Box>
                            <Box component='form' onSubmit={handleAddTax} sx={{ display: 'flex', gap: 4, marginTop: 2, marginBottom: 4 }}>
                                <FormControl sx={{ width: 200 }}>
                                    <InputLabel>Agregar Impuesto</InputLabel>
                                    <Select label='Agregar Impuesto' >
                                        {
                                            taxes.map((tax: any) => {
                                                return <MenuItem value={tax.id}>{tax.nombre}
                                                </MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <Button type='submit' color='success' variant='contained'>Agregar</Button>
                            </Box>

                            <Box>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Impuesto</TableCell>
                                            <TableCell>Cuotas</TableCell>
                                            <TableCell>Acciones</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            clientTaxes.map((tax: any) => {
                                                return (
                                                    <TableRow>
                                                        <TableCell>{tax.nombre}</TableCell>
                                                        <TableCell> {tax.cuotas.length}</TableCell>
                                                        <TableCell>
                                                            <Button color='error' variant='contained' onClick={e => handleDeleteTax(tax.id)}>Eliminar</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </Box>
                        </Box>
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