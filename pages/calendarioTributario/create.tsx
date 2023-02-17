import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import AccountBalance from "@mui/icons-material/AccountBalance";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Layout from "../../components/layout";

export default function Create() {
    const avatarSize = { width: 120, height: 120 }
    const avatarIconSize = { width: 80, height: 80 }
    const [name, setName] = useState('');
    const [period, setPeriod] = useState(1);
    const [installments, setInstallments] = useState(0);

    const handlePeriodChange = (event: SelectChangeEvent<unknown>) => {
        setPeriod(event.target.value as number);
    }

    const periodos = [
        { name: 'Anual', value: 1, frequency: 1 },
        { name: 'Semestral', value: 2, frequency: 2 },
        { name: 'Cuatrimestral', value: 3, frequency: 3 },
        { name: 'Trimestral', value: 4, frequency: 4 },
        { name: 'Bimestral', value: 5, frequency: 6 },
        { name: 'Mensual', value: 6, frequency: 12 },
        { name: 'Quincenal', value: 7, frequency: 24 },
    ]

    const accordionSummaryStyle = {
        backgroundColor: "primary.main",
        color: 'white',
    }

    const getInstallments = () => {
        const components = [];
        const frequency = periodos.find((periodo) => periodo.value === period)?.frequency || 0;
        for (let i = 0; i < frequency; i++) {
            components.push(

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={accordionSummaryStyle}
                    >
                        <Typography>Cuota No. {i + 1}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        holaa
                    </AccordionDetails>
                </Accordion>
            )
        }

        return components;
    }
    return (
        <Layout>
            <Box display={'flex'} alignItems='center' flexDirection={'column'}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Agregar Impuesto
                </Typography>
                <Avatar sx={avatarSize}>
                    <AccountBalance sx={avatarIconSize}></AccountBalance>
                </Avatar>

                <Box display={'flex'} alignItems='center' flexDirection={'column'}>
                    <FormControl>
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
                    <FormControl sx={{ width: 160 }}>
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

                {getInstallments()}
            </Box>
        </Layout>

    )
}