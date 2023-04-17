import AccountBalance from "@mui/icons-material/AccountBalance";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "../../components/layout";

import axios from "axios";
import Head from "next/head";
import { periods, tiposPersona } from '../../config';
import styles from '../../styles/calendarioTributario/create.module.css';

import { Departamento, Municipio, nuevoImpuesto } from "../../types";
import FeedsTable from "../../components/taxes/feedsTable";
import TaxForm from "../../components/taxes/taxForm";
import TaxScheduler from "../../components/taxes/taxScheduler";
import MessageModal from "../../components/messageModal";

export default function Create({ ...props }) {
    // hooks
    const [impuesto, setImpuesto] = useState<nuevoImpuesto>({
        tipo: 1,
        nombre: '',
        frecuencia: 0,
        persona: 0,
        numero_digitos: 1,
        cuotas: [] 
    } as unknown as  nuevoImpuesto);
    const [submited, setSubmited] = useState<boolean>(false);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    // styles
    const avatarSize = 160
    const avatarIconSize = 120
    

    // functions
    const handleSubmit = async () => {
        if (impuesto.nombre.length === 0) return alert('debe ingresar un nombre para el impuesto')
        setSubmited(true);

        const url = '/api/tax';

        try {
           const request = await axios.post(url, impuesto);
            setModalOpen(true);
            setModalTitle('Impuesto agregado con éxito');
            setError(false);
            window.location.href = '/calendarioTributario';
        } catch (error) {
            setModalOpen(true);
            setModalTitle('Error al agregar el impuesto');
            setError(true);
            alert(error);
            console.error(error);
        }

    }

    return (
        <Layout>
            <Head>
                <title>Agregar impuesto</title>
            </Head>
            <Box className={`${styles.container}`}>
                <MessageModal  error={error} modalOpen={modalOpen} setModalOpen={setModalOpen} title={modalTitle}/>
                <Box display='flex' alignItems='center' flexDirection={'column'} marginTop={10} marginBottom={7}>
                    <Typography variant="h4" component="h1" marginBottom={8} >
                        Agregar Impuesto
                    </Typography>
                    <Avatar sx={{ width: avatarSize, height: avatarSize }}>
                        <AccountBalance sx={{ width: avatarIconSize, height: avatarIconSize }}></AccountBalance>
                    </Avatar>
                </Box>

                <TaxForm
                    impuesto={impuesto}
                    setImpuesto={setImpuesto}
                />

                <TaxScheduler cuotas={impuesto.cuotas} />

                <FeedsTable cuotas={impuesto.cuotas} setCuotas={(cuotas) => setImpuesto({ ...impuesto, cuotas})} />
                <Box display='flex' justifyContent='center' width='100%' marginTop={5} marginBottom={5}>
                    <Button disabled={submited} variant="contained" color='success' size="large" onClick={handleSubmit}>Guardar</Button>
                </Box>
            </Box>
        </Layout>

    )
}
