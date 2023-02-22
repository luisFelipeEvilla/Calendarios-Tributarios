import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import AccountBalance from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../components/layout";
import TaxesScheduler from "../../components/layouts/schedulers/taxesScheduler";
import FeedForm from "../../components/layouts/taxes/feedForm";
import { useScheduler } from "@aldabil/react-scheduler";

type Feed = { nit: number, date: Date }

export default function Create() {
    const avatarSize = { width: 120, height: 120 }
    const avatarIconSize = { width: 80, height: 80 }
    const [name, setName] = useState('');
    const [period, setPeriod] = useState(1);
    const [feeds, setFeeds] = useState([[]]);
    const [scheduledFeeds, setScheduledFeeds] = useState<ProcessedEvent[] | undefined>();

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
    }, [feeds])

    // fake data
    const periodos = [
        { name: 'Anual', value: 1, frequency: 1 },
        { name: 'Semestral', value: 2, frequency: 2 },
        { name: 'Cuatrimestral', value: 3, frequency: 3 },
        { name: 'Trimestral', value: 4, frequency: 4 },
        { name: 'Bimestral', value: 5, frequency: 6 },
        { name: 'Mensual', value: 6, frequency: 12 },
        { name: 'Personalizado', value: 7, frequency: 1 }
    ]

    // styles
    const accordionSummaryStyle = {
        backgroundColor: "primary.main",
        color: 'white',
    }

    // functions
    const handleSubmit = () => {
        //Todo implement save tax logic
        router.push('/calendarioTributario')
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

    const handlePeriodChange = (event: SelectChangeEvent<unknown>) => {
        const periodsNumber = event.target.value as number;
        setPeriod(periodsNumber);

        const frequency = periodos.find(periodo => periodo.value === periodsNumber)?.frequency || 0;

        const newFeeds = [];

        for (let i = 0; i < frequency; i++) {
            newFeeds.push([]);
        }

        // @ts-ignore
        setFeeds(newFeeds);
    }


    const getFeeds = () => {
        const frequency = periodos.find((periodo) => periodo.value === period)?.frequency || 0;

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
                    <p><b>Periodo:</b> {initDate.toDateString()} - {endDate.toDateString()}</p>
                    <FeedForm index={index} handleAddFeed={handleAddFeed} />
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Digito/s de asignación</TableCell>
                                    <TableCell>Fecha de presentación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    installment.map((installment) => (
                                        <TableRow>
                                            <TableCell>{installment.nit}</TableCell>
                                            <TableCell>{installment.date.toDateString()}</TableCell>
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
            <Box display={'flex'} alignItems='center' flexDirection={'column'}>
                <Box display='flex' alignItems='center' flexDirection={'column'} marginTop={10} marginBottom={7}>
                    <Typography variant="h4" component="h1" marginBottom={8} >
                        Agregar Impuesto
                    </Typography>
                    <Avatar sx={avatarSize}>
                        <AccountBalance sx={avatarIconSize}></AccountBalance>
                    </Avatar>
                </Box>


                <Box display={'flex'} alignItems='center' flexDirection={'column'} width={300}>
                    <FormControl fullWidth>
                        <TextField
                            margin="normal"
                            fullWidth
                            id="name"
                            type={'text'}
                            label="Nombre"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel> Frecuencia</InputLabel>
                        <Select name='Periodicidad' value={period} fullWidth label='frecuencia' onChange={handlePeriodChange}>
                            {
                                periodos.map((periodo) => (
                                    <MenuItem key={periodo.value} value={periodo.value}
                                    >{periodo.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </Box>

                <Box width='100%' marginTop={10} display='flex' flexDirection={'column'} alignItems='center' >
                    <Box width='80%' marginBottom={10}>
                        <Scheduler view='month' events={scheduledFeeds || []} editable={false} deletable={false} draggable={false}/>
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