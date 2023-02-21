import AccountBalance from "@mui/icons-material/AccountBalance";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Button, FormGroup, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { DatePicker, DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../../components/layout";
import TaxesScheduler from "../../components/layouts/schedulers/taxesScheduler";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function Create() {
    const avatarSize = { width: 120, height: 120 }
    const avatarIconSize = { width: 80, height: 80 }
    const [name, setName] = useState('');
    const [period, setPeriod] = useState(1);
    const [installments, setInstallments] = useState([[{ nit: 1, fecha: new Date() }, { nit: 2, fecha: new Date() }]]);
    
    const router = useRouter();

    const handlePeriodChange = (event: SelectChangeEvent<unknown>) => {
        const periodsNumber = event.target.value as number;
        setPeriod(periodsNumber);
        
        const frequency = periodos.find(periodo => periodo.value === periodsNumber)?.frequency || 0;
        
        const newInstallments = [];

        for (let i = 0; i < frequency; i++) {
            newInstallments.push([]);
        }

        // @ts-ignore
        setInstallments(newInstallments);
    }

    const handleSubmit = () => {
        //Todo implement save tax logic
        router.push('/calendarioTributario')
    }

    const handleAddInstallment = (index: number) => {
        const newInstallments = [...installments];
        newInstallments[index].push({ nit: 1, fecha: new Date() });
        setInstallments(newInstallments);
    }

    const periodos = [
        { name: 'Anual', value: 1, frequency: 1 },
        { name: 'Semestral', value: 2, frequency: 2 },
        { name: 'Cuatrimestral', value: 3, frequency: 3 },
        { name: 'Trimestral', value: 4, frequency: 4 },
        { name: 'Bimestral', value: 5, frequency: 6 },
        { name: 'Mensual', value: 6, frequency: 12 },
        { name: 'Personalizado', value: 7, frequency: 1 }
    ]

    const accordionSummaryStyle = {
        backgroundColor: "primary.main",
        color: 'white',
    }

    const getInstallments = () => {
        const components = [];
        const frequency = periodos.find((periodo) => periodo.value === period)?.frequency || 0;

        const initDate = new Date(new Date().getFullYear(), 0, 1);
        const endDate = new Date(new Date().getFullYear(), 12 / frequency, 0);

        for (let i = 0; i < frequency; i++) {
            const installment = installments[i];

            components.push(
                <Accordion sx={{ width: '100%' }} key={i}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={accordionSummaryStyle}
                    >
                        <Typography>Cuota No. {i + 1}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <p><b>Periodo:</b> {initDate.toDateString()} - {endDate.toDateString()}</p>
                        <Button onClick={e => handleAddInstallment(i)} variant="contained" color="success">Agregar</Button>
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
                                                <TableCell>{installment.fecha.toDateString()}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            )

            initDate.setMonth(initDate.getMonth() + 12 / frequency);
            endDate.setMonth(endDate.getMonth() + 12 / frequency + 1, 0);
        }

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
                    <FormControl fullWidth >
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
                        <TaxesScheduler />
                    </Box>
                    {getInstallments()}
                </Box>

                <Box display='flex' justifyContent='center' width='100%' marginTop={5} marginBottom={5}>
                    <Button variant="contained" color='success' size="large" onClick={handleSubmit}>Guardar</Button>
                </Box>
            </Box>
        </Layout>

    )
}