import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { cuota } from "../../types";
import FeedForm from "./feedForm";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";

type Period = { name: string, value: number, frequency: number };
type PropsType = {
    cuotas: cuota[], setCuotas: (feeds: any) => void
}

export default function FeedsTable({ ...props }: PropsType) {
    const accordionSummaryStyle = {
        backgroundColor: "primary.main",
        color: 'white',
    }

    const formatoFecha: Intl.DateTimeFormatOptions =  { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const handleAddFeed = (index: number, fecha: {nit: number, date: any}) => {
        const nit = fecha.nit;
        const date = new Date(fecha.date['$y'], fecha.date['$M'], fecha.date['$D']);

        const newCuota = { nit, fecha: date }
        const newCuotas = [...props.cuotas];
        //@ts-ignore
        newCuotas[index].fechas_presentacion.push(newCuota);
        // organize feeds by date
        newCuotas[index].fechas_presentacion.sort((a: any, b: any) => { return a.fecha.getTime() - b.fecha.getTime() });

        props.setCuotas(newCuotas);
    }

    const handleDeletFeed = (index: number, index1: number) => {
        const newFeeds = [...props.cuotas];
        newFeeds[index].fechas_presentacion.splice(index1, 1);

        props.setCuotas(newFeeds);
    }
    
    return (
        <Box width='100%' marginTop={10} display='flex' flexDirection={'column'} alignItems='center' >
            {
                props.cuotas.map((cuota, index) => {
                    const component = <Accordion sx={{ width: '100%' }} key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            sx={accordionSummaryStyle}
                        >
                            <Typography>Cuota No. {index + 1}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
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
                                    cuota.fechas_presentacion.map((fecha, index1: number) => (
                                        <TableRow key={index1}>
                                            <TableCell>{fecha.nit}</TableCell>
                                            <TableCell>{fecha.fecha.toLocaleDateString('es-co', formatoFecha)}</TableCell>
                                            <TableCell><Button onClick={e => handleDeletFeed(index, index1)} variant="contained" color="error">Eliminar</Button></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>

                    </Accordion>
                    return component;
                })
            }
        </Box>
    )
}
