import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import AccountBalance from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import FeedForm from "../../components/layouts/taxes/feedForm";
import { es } from "date-fns/locale";

import styles from '../../styles/calendarioTributario/create.module.css';
import axios from "axios";

type Feed = { nit: number, date: Date }
type Municipio = { codigo_departamento: number, codigo_municipio: number, municipio: string }
type Departamento = { codigo_departamento: number, departamento: string, municipios: Municipio[] }

type propsType = { departamentos: Departamento[] }
import { periods, personTypes, taxTypes } from '../../config';

export default function Create({ ...props }: propsType) {
    const avatarSize = { width: 160, height: 160 }
    const avatarIconSize = { width: 120, height: 120 }
    const [name, setName] = useState('');
    const [period, setPeriod] = useState(1);
    const [feeds, setFeeds] = useState<Feed[][]>([[]]);
    const [scheduledFeeds, setScheduledFeeds] = useState<ProcessedEvent[] | undefined>();
    const [taxType, setTaxType] = useState(1);
    const [departamento, setDepartamento] = useState(0);
    const [municipio, setMunicipio] = useState(0);
    const [applyTo, setApplyTo] = useState(1);

    const [municipios, setMunicipios] = useState<Municipio[] | []>([]);

    const { setEvents } = useScheduler();
    // hooks
    const router = useRouter();

    useEffect(() => {
        const events: ProcessedEvent[] = [];

        feeds.forEach((feed, index) => {
            feed.forEach((f: Feed, index) => {
                events.push({
                    event_id: index,
                    title: `${f.nit}`,
                    start: f.date,
                    end: f.date,
                    color: '#3f51b5',
                    textColor: 'white',
                    allDay: true,
                })
            })
        })

        setScheduledFeeds(events);
        setEvents(events);
    }, [feeds, setEvents])



    // styles
    const accordionSummaryStyle = {
        backgroundColor: "primary.main",
        color: 'white',
    }

    // functions
    const handleSubmit = async () => {
        //Todo implement save tax logic

        const url = '/api/handleAddImpuesto';

        if (name.length === 0 || name === '') return alert('debe ingresar un nombre para el impuesto')
        const body = {
            name,
            applyTo: personTypes[applyTo - 1].name,
            period: periods[period - 1].name,
            taxType,
            departamento,
            municipio,
            feeds
        }

        try {
            const request = await axios.post(url, body, { headers: { 'Content-Type': 'application/json' } });
            console.log(request.data.message);
            router.push('/calendarioTributario');
        } catch (error) {
            console.error(error);
        }

    }

    const handleAddFeed = (index: number, feed: Feed) => {
        //@ts-ignore
        const newFeed = { nit: feed.nit, date: feed.date['$d'] }
        const newFeeds = [...feeds];
        newFeeds[index].push(newFeed);

        // organize feeds by date
        newFeeds[index].sort((a, b) => a.date.getTime() - b.date.getTime());

        setFeeds(newFeeds);
    }

    const handleDeletFeed = (index: number, index1: number) => {
        const newFeeds = [...feeds];
        newFeeds[index].splice(index1, 1);

        setFeeds(newFeeds);
    }

    const handlePeriodChange = (event: SelectChangeEvent<unknown>) => {
        const periodsNumber = event.target.value as number;
        setPeriod(periodsNumber);

        const frequency = periods.find(periodo => periodo.value === periodsNumber)?.frequency || 0;

        const newFeeds = [];

        for (let i = 0; i < frequency; i++) {
            newFeeds.push([]);
        }

        // @ts-ignore
        setFeeds(newFeeds);
    }

    const handledDepartamentoChange = (event: SelectChangeEvent<unknown>) => {
        const departamentoCode = event.target.value as number;
        setDepartamento(departamentoCode);
        const municipios = props.departamentos.find(departamento => departamento.codigo_departamento === departamentoCode)?.municipios || [];
        setMunicipios(municipios);
    }

    const handleTaxTypeChange = (event: SelectChangeEvent<unknown>) => {
        const taxType = event.target.value as number;
        setTaxType(taxType);
        setDepartamento(0);
        setMunicipio(0);
    }


    const getFeeds = () => {
        const frequency = periods.find((periodo) => periodo.value === period)?.frequency || 0;

        const initDate = new Date(new Date().getFullYear(), 0, 1);
        const endDate = new Date(new Date().getFullYear(), 12 / frequency, 0);
        const components = feeds.map((installment, index) => {
            const component = <Accordion sx={{ width: '100%' }} key={index}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                    sx={accordionSummaryStyle}
                >
                    <Typography>Cuota No. {index + 1}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <p><b>Periodo:</b> {initDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
                    <FeedForm index={index} handleAddFeed={handleAddFeed} />
                    <TableContainer component={Paper}>
                        <Table align="center">
                            <TableHead >
                                <TableRow>
                                    <TableCell>Digito/s de asignación</TableCell>
                                    <TableCell>Fecha de presentación</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    installment.map((installment: Feed, index1: number) => (
                                        <TableRow key={index1}>
                                            <TableCell>{installment.nit}</TableCell>
                                            <TableCell>{installment.date.toDateString()}</TableCell>
                                            <TableCell><Button onClick={e => handleDeletFeed(index, index1)} variant="contained" color="error">Eliminar</Button></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

            initDate.setMonth(initDate.getMonth() + 12 / frequency);
            endDate.setMonth(endDate.getMonth() + 12 / frequency + 1, 0);

            return component;
        })

        return components;
    }

    return (
        <Layout>
            <Box className={`${styles.container}`}>
                <Box display='flex' alignItems='center' flexDirection={'column'} marginTop={10} marginBottom={7}>
                    <Typography variant="h4" component="h1" marginBottom={8} >
                        Agregar Impuesto
                    </Typography>
                    <Avatar sx={avatarSize}>
                        <AccountBalance sx={avatarIconSize}></AccountBalance>
                    </Avatar>
                </Box>


                <Box className={`${styles.container} ${styles.formContainer}`}>
                    <FormControl fullWidth>
                        <TextField
                            id="name"
                            type={'text'}
                            label="Nombre"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: 20 }} >Aplica a</InputLabel>
                        <Select name='Aplica' value={applyTo} fullWidth label='Aplica a' onChange={e => setApplyTo(e.target.value as number)}>
                            {
                                personTypes.map((taxType) => (
                                    <MenuItem key={taxType.value} value={taxType.value}
                                    >{taxType.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: 20 }}> Frecuencia</InputLabel>
                        <Select name='Periodicidad' value={period} fullWidth label='frecuencia' onChange={handlePeriodChange}>
                            {
                                periods.map((periodo) => (
                                    <MenuItem key={periodo.value} value={periodo.value}
                                    >{periodo.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: 20 }} >Tipo de impuesto</InputLabel>
                        <Select name='Tipo de impuesto' value={taxType} fullWidth label='Tipo de impuesto' onChange={handleTaxTypeChange}>
                            {
                                taxTypes.map((taxType) => (
                                    <MenuItem key={taxType.value} value={taxType.value}
                                    >{taxType.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    {
                        taxType != 1 ?
                            <FormControl fullWidth>
                                <InputLabel sx={{ fontSize: 20 }}>Ubicación</InputLabel>
                                <Select name="departamento" value={departamento} onChange={handledDepartamentoChange} required>
                                    <MenuItem value={0}>Selecciona un departamento</MenuItem>
                                    {
                                        props.departamentos.map((departamento, index) => <MenuItem value={departamento.codigo_departamento} key={index}>{departamento.departamento}</MenuItem>)
                                    }
                                </Select>
                            </FormControl> : null
                    }
                    {
                        taxType === 3 ?
                            <FormControl fullWidth>
                                <InputLabel sx={{ fontSize: 20 }}>Municipio</InputLabel>
                                <Select name="municipio" value={municipio} onChange={e => setMunicipio(e.target.value as number)} required>
                                    <MenuItem value={0}>Selecciona un municipio</MenuItem>
                                    {
                                        municipios.map((municipio, index) => <MenuItem value={municipio.codigo_municipio} key={index}>{municipio.municipio}</MenuItem>)
                                    }
                                </Select>
                            </FormControl> : null
                    }
                </Box>

                <Box width='100%' marginTop={10} display='flex' flexDirection={'column'} alignItems='center' >
                    <Box width='80%' marginBottom={10}>
                        <Scheduler locale={es} view='month' events={scheduledFeeds || []} editable={false} deletable={false} draggable={false} />
                    </Box>
                    {getFeeds()}
                </Box>

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