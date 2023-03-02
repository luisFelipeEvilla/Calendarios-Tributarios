import { useScheduler } from "@aldabil/react-scheduler";
import { Avatar, Box, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import TaxForm from "../../components/taxes/taxForm";
import { Feed } from "../../types";

import { Departamento } from "../../types";

import styles from '../../styles/calendarioTributario/create.module.css';
import { AccountBalance } from "@mui/icons-material";

export default function CalendarioTributario() {
    const [name, setName] = useState('');
    const [period, setPeriod] = useState(1);
    const [feeds, setFeeds] = useState<Feed[][]>([[]]);
    const [taxType, setTaxType] = useState(1);
    const [departamento, setDepartamento] = useState(0);
    const [municipio, setMunicipio] = useState(0);
    const [applyTo, setApplyTo] = useState(1);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const { setEvents } = useScheduler();

    const router = useRouter();


    const avatarSize = 160
    const avatarIconSize = 120

    useEffect(() => {
        if (!router.query.id) return;

        fetchData();
    }, [router.isReady])

    const fetchData = async () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/impuesto/${router.query.id}`;

        const response = await axios.get(url);

        const tax = response.data.data;
        setName(tax.nombre);
        setPeriod(tax.frecuencia);
        setFeeds(tax.cuotas);
        setTaxType(tax.tipo);
        setDepartamento(tax.departamento);
        setMunicipio(tax.municipio);
        setApplyTo(tax.persona);

        const departamentos = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/departamentos`);

        setDepartamentos(departamentos.data.data);
    }

    return (
        <Layout>
            <Head>
                <title>Editar Impuesto</title>
            </Head>
            <Box className={`${styles.container}`}>
                <Box display='flex' alignItems='center' flexDirection={'column'} marginTop={10} marginBottom={7}>
                    <Typography variant="h4" component="h1" marginBottom={8} >
                        Editar Impuesto
                    </Typography>
                    <Avatar sx={{ width: avatarSize, height: avatarSize }}>
                        <AccountBalance sx={{ width: avatarIconSize, height: avatarIconSize }}></AccountBalance>
                    </Avatar>
                </Box>

                <TaxForm
                    name={name} setName={setName}
                    applyTo={applyTo} setApplyTo={setApplyTo}
                    period={period} setPeriod={setPeriod}
                    taxType={taxType} setTaxType={setTaxType}
                    departamento={departamento} setDepartamento={setDepartamento}
                    municipio={municipio} setMunicipio={setMunicipio}
                    feeds={feeds} setFeeds={setFeeds}
                    departamentos={departamentos}
                    municipios={[]} setMunicipios={() => { }}
                />
            </Box>

        </Layout>
    )
}