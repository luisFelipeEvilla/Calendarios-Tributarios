import { Grid, Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Input } from "@mui/material"
import axios from "axios";
import { SetStateAction } from "react";
import { tiposPersona } from "../../../config"
import cliente from "../../../pages/api/client"

export default function Formularioclientee({ ...props }) {
    
    const handleTipoPersonaChange = (e: any) => {
        props.setCliente({ ...props.cliente, tipo_persona: e.target.value });
    }

    const handleNitChange = (e: any) => {
        const nit = parseInt(e.target.value);
        props.setCliente({ ...props.cliente, nit });
    }

    const handleNombreEmpresaChange = (e: any) => {
        props.setCliente({ ...props.cliente, nombre_empresa: e.target.value });
    }

    const handlePaginaWebChange = (e: any) => {
        props.setCliente({ ...props.cliente, pagina_web: e.target.value });
    }

    const handleUpdatecliente = async (e: any) => {
        e.preventDefault();

        try {
            const url = `/api/client/${props.cliente.id}`;

            const response = await axios.put(url, props.cliente);

            props.setModalOpen(true);
            props.setModalMessage('cliente actualizado correctamente');
            props.setError(false);
        } catch (error) {
            console.log(error);
            props.setModalOpen(true);
            props.setModalMessage('Error al actualizar el cliente');
            props.setError(true);
        }
    }

    const handleEmailNotificacionesChange = (e: any) => {
        props.setCliente({ ...props.cliente, email_calendario: e.target.value });
    }

    return (
        <Grid container spacing={0} maxWidth={1000} marginTop={5}>
            <Grid item md={6}>
                <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant='h4'>Información General</Typography>
                    {formInput('Nombre de la empresa', props.cliente.nombre_empresa, handleNombreEmpresaChange)}
                    {formInput('NIT', props.cliente.nit, handleNitChange)}
                    {formInput('Página web', props.cliente.pagina_web, handlePaginaWebChange)}
                    {formInput('Email de Notificaciones', props.cliente.email_calendario, handleEmailNotificacionesChange)}
                </Box>
            </Grid>
            <Grid item md={6}>
                <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant='h4'>Información Tributaria</Typography>
                    <FormControl sx={{ width: 300, marginTop: 3 }}>
                        <InputLabel htmlFor="nit">Tipo de Persona</InputLabel>
                        <Select value={props.cliente.tipo_persona} onChange={handleTipoPersonaChange} name="Tipo de persona" label="Tipo de persona">
                            {
                                tiposPersona.map((tipo, index) => {
                                    return <MenuItem key={index} value={tipo.value}>{tipo.name}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </Box>
            </Grid>

            <Grid item md={12} >
                <Box className='container' sx={{ justifyContent: 'center', marginTop: 5 }}>
                    <Button variant='contained' color='success' onClick={handleUpdatecliente}>Actualizar</Button>
                </Box>
            </Grid>
        </Grid>
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