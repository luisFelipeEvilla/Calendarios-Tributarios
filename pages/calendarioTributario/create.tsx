import AccountBalance from "@mui/icons-material/AccountBalance";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import Layout from "../../components/layout";

import axios from "axios";
import Head from "next/head";
import { periods, personTypes } from '../../config';
import styles from '../../styles/calendarioTributario/create.module.css';

import { Departamento, Feed, Municipio } from "../../types";
import FeedsTable from "../../components/taxes/feedsTable";
import TaxForm from "../../components/taxes/taxForm";
import TaxScheduler from "../../components/taxes/taxScheduler";
type propsType = { departamentos: Departamento[] }

export default function Create({ ...props }: propsType) {
    // hooks
    const [name, setName] = useState('');
    const [period, setPeriod] = useState(0);
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [taxType, setTaxType] = useState(1);
    const [departamento, setDepartamento] = useState(0);
    const [municipio, setMunicipio] = useState(0);
    const [applyTo, setApplyTo] = useState(0);
    const [numeroDigitos, setNumeroDigitos] = useState(1);
    const [numeroCuotas, setNumeroCuotas] = useState(0);

    // info from api to forms
    const [municipios, setMunicipios] = useState<Municipio[] | []>([]);

    // styles
    const avatarSize = 160
    const avatarIconSize = 120

    // functions
    const handleSubmit = async () => {
        //Todo implement save tax logic

        const url = '/api/handleAddImpuesto';

        if (name.length === 0 || name === '') return alert('debe ingresar un nombre para el impuesto')
        const body = {
            name,
            applyTo: applyTo,
            period: period,
            taxType,
            departamento,
            municipio,
            feeds,
            numeroDigitos
        }

        try {
            const request = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
            window.location.href = '/calendarioTributario';
        } catch (error) {
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
                <Box display='flex' alignItems='center' flexDirection={'column'} marginTop={10} marginBottom={7}>
                    <Typography variant="h4" component="h1" marginBottom={8} >
                        Agregar Impuesto
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
                    numeroDigitos={numeroDigitos} setNumeroDigitos={setNumeroDigitos}
                    numeroCuotas={numeroCuotas} setNumeroCuotas={setNumeroCuotas}
                    departamentos={props.departamentos}
                    municipios={municipios} setMunicipios={setMunicipios}
                />

                <TaxScheduler feeds={feeds} />

                <FeedsTable periods={periods} periodSelected={period} feeds={feeds} frequency={0} setFeeds={setFeeds} />
                <Box display='flex' justifyContent='center' width='100%' marginTop={5} marginBottom={5}>
                    <Button variant="contained" color='success' size="large" onClick={handleSubmit}>Guardar</Button>
                </Box>
            </Box>
        </Layout>

    )
}

export async function getServerSideProps(context: any) {
    let departamentos: Departamento[] = [];
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/departamentos`;

        const response = await axios.get(url);

        departamentos = response.data.data;
    } catch (error) {

    }

    return {
        props: {
            departamentos
        }
    }
}