import { useScheduler } from "@aldabil/react-scheduler";
import { Avatar, Box, Button, Typography } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import TaxForm from "../../components/taxes/taxForm";
import { cuota, Municipio, nuevoImpuesto } from "../../types";

import { Departamento } from "../../types";

import styles from '../../styles/calendarioTributario/create.module.css';
import { AccountBalance } from "@mui/icons-material";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import FeedsTable from "../../components/taxes/feedsTable";
import { periods } from "../../config";
import TaxScheduler from "../../components/taxes/taxScheduler";
import Spinner from "../../components/layouts/spinner";
import { fechas_presentacion } from "@prisma/client";
import MessageModal from "../../components/messageModal";

export default function CalendarioTributario() {
    const [impuesto, setImpuesto] = useState<nuevoImpuesto>({ cuotas: [] } as unknown as nuevoImpuesto);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [error, setError] = useState(false);

    const { setEvents } = useScheduler();

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const avatarSize = 160
    const avatarIconSize = 120

    useEffect(() => {
        if (!router.query.id) return;

        const fetchData = async () => {
            const url = `/api/tax/${router.query.id}`;

            const response = await axios.get(url);

            const tax = response.data;

            tax.cuotas = tax.cuotas.map((cuota: cuota) => {
                cuota.fechas_presentacion = cuota.fechas_presentacion.map((fecha_presentacion: fechas_presentacion) => {
                    // Crear una nueva fecha y establecer la hora a las 0 horas
                    const fecha = new Date(`${fecha_presentacion.fecha}T00:00:00`);
                    console.log(fecha);
                    fecha_presentacion.fecha = fecha;
                    return fecha_presentacion;
                })
                return cuota;
            })
            setImpuesto(tax);

            setLoading(false);
        }
        fetchData();
    }, [router.query.id])

    useEffect(() => {
        const updateSchedule = () => {
            const events: ProcessedEvent[] = [];
            impuesto.cuotas.forEach((cuota, index) => {
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
        updateSchedule();
    }, [impuesto.cuotas])

    const handleSubmit = async () => {
        const url = `/api/tax/${router.query.id}`;

        const data = impuesto;

        try {
            const response = await axios.put(url, data)
            setError(false);
            setModalTitle("Impuesto actualizado correctamente");
            setModalOpen(true);
        } catch (error) {
            console.error(error);
            setError(true);
            setModalTitle("Error al actualizar el impuesto");
            setModalOpen(true);
        }
    }

    return (
        <Layout>
            <Head>
                <title>Editar Impuesto</title>
            </Head>
            {loading ? <Spinner /> :
                <Box className={`${styles.container}`}>
                    <MessageModal modalOpen={modalOpen} setModalOpen={setModalOpen} error={error} title={modalTitle} />
                    <Box display='flex' alignItems='center' flexDirection={'column'} marginTop={10} marginBottom={7}>
                        <Typography variant="h4" component="h1" marginBottom={8} >
                            Editar Impuesto
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

                    <FeedsTable cuotas={impuesto.cuotas} setCuotas={(cuotas) => setImpuesto({ ...impuesto, cuotas })} />
                    <Box display='flex' justifyContent='center' width='100%' marginTop={5} marginBottom={5}>
                        <Button variant="contained" color='success' size="large" onClick={handleSubmit}>Guardar</Button>
                    </Box>
                </Box>
            }
        </Layout>
    )
}