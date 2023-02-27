import { Avatar, Box, FormControl, Grid, Input, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { SetStateAction, useEffect, useState } from "react";
import Layout from "../../components/layout";
import PeopleIcon from '@mui/icons-material/People';


type Client = { id: number, nit: number, nombre_empresa: string, pagina_web: string, emails: string, nombre_representante_legal: string, prefijo_empresa: string };
export default function Client() {
    const [loading, setLoading] = useState<boolean>(true);
    const [client, setClient] = useState<Client>({} as Client);
    // get id from url
    const router = useRouter();



    useEffect(() => {
        const getClient = async () => {

            const { id } = router.query;

            const url = `/api/client/${id}`;
            try {
                const response = await axios.get(url);
                setClient(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        }

        getClient();
    }, [])

    const handleNitChange = (e: any) => {
        const nit = parseInt(e.target.value);
        setClient({ ...client, nit});
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

    return (
        <Layout>
            <Head>
                <title>Editar cliente</title>
            </Head>
            {
                loading ? <h1>Cargando...</h1> :
                    <Box className="container" justifyContent={'center'} flexDirection='column' alignItems={'center'}>
                        <Avatar sx={{ height: 200, width: 200 }}>
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
                                    <FormControl sx={{width: 300, marginTop: 3}}>
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