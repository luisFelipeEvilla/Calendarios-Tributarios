import { useScheduler } from "@aldabil/react-scheduler";
import { Avatar, Box, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import TaxForm from "../../components/taxes/taxForm";
import { cuota, Municipio } from "../../types";

import { Departamento } from "../../types";

import styles from '../../styles/calendarioTributario/create.module.css';
import { AccountBalance } from "@mui/icons-material";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import FeedsTable from "../../components/taxes/feedsTable";
import { periods } from "../../config";
import TaxScheduler from "../../components/taxes/taxScheduler";
import Spinner from "../../components/layouts/spinner";
import { fechas_presentacion } from "@prisma/client";

export default function CalendarioTributario() {
    const [name, setName] = useState('');
    const [period, setPeriod] = useState(1);
    const [cuotas, setCuotas] = useState<cuota[]>([]);
    const [taxType, setTaxType] = useState(1);
    const [departamento, setDepartamento] = useState(0);
    const [municipio, setMunicipio] = useState(0);
    const [applyTo, setApplyTo] = useState(0);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [numeroDigitos, setNumeroDigitos] = useState(1);
    const [numeroCuotas, setNumeroCuotas] = useState(0);

    const { setEvents } = useScheduler();

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    
    const avatarSize = 160
    const avatarIconSize = 120

    useEffect(() => {
        if (!router.query.id) return;

        fetchData();
    }, [router.isReady])

    useEffect(() => {
        updateSchedule();
    }, [cuotas])

    const fetchData = async () => {
        const url = `/api/tax/${router.query.id}`;

        const response = await axios.get(url);

        const tax = response.data;

        setName(tax.nombre);
        setPeriod(tax.frecuencia);
        setTaxType(tax.tipo);
        setDepartamento(tax.departamento);
        setMunicipio(tax.municipio);
        setApplyTo(tax.persona);
        setNumeroDigitos(tax.numero_digitos);

        const newCuotas = tax.cuotas.map((cuota: cuota) => {
            cuota.fechas_presentacion = cuota.fechas_presentacion.map((fecha_presentacion: fechas_presentacion) => {
                fecha_presentacion.fecha = new Date(fecha_presentacion.fecha);
                return fecha_presentacion;
            })
            return cuota;
        })

        setCuotas(newCuotas);
        setNumeroCuotas(newCuotas.length);

        const departamentos = await axios.get(`/api/departamento`);
        setDepartamentos(departamentos.data);

        setLoading(false);
    }

    const updateSchedule = () => {
        const events: ProcessedEvent[] = [];
        cuotas.forEach((cuota, index) => {
            cuota.fechas_presentacion.forEach((fecha) => {
                if (typeof fecha.fecha === 'string') fecha.fecha = new Date(fecha.fecha);
                events.push({
                    event_id: index,
                    title: `${fecha.nit}`,
                    start: fecha.fecha,
                    end: fecha.fecha,
                    color: '#3f51b5',
                    textColor: 'white',
                    allDay: true,
                })
            })
        })

        setEvents(events);

    }

    return (
        <Layout>
            <Head>
                <title>Editar Impuesto</title>
            </Head>
            { loading ? <Spinner/>:
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
                        feeds={cuotas} setFeeds={setCuotas}
                        numeroDigitos={numeroDigitos} setNumeroDigitos={setNumeroDigitos}
                        numeroCuotas={numeroCuotas} setNumeroCuotas={setNumeroCuotas}
                        departamentos={departamentos}
                        municipios={municipios} setMunicipios={setMunicipios}
                    />

                    <TaxScheduler feeds={cuotas} />
                    <FeedsTable periods={periods} periodSelected={period} feeds={cuotas} frequency={0} setFeeds={setCuotas} />
                </Box>

            }
        </Layout>
    )
}