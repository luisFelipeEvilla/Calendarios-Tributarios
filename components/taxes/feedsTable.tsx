import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Cuota, Feed } from "../../types";
import FeedForm from "./feedForm";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import { Dayjs } from "dayjs";

type Period = { name: string, value: number, frequency: number };
type PropsType = {
    periods: Period[], periodSelected: number, 
    frequency: number,
    feeds: Feed[], setFeeds: (feeds: any) => void
}

export default function FeedsTable({ ...props }: PropsType) {
    const [frequency, setFrequency] = useState(props.periods[props.periodSelected].frequency);
    const initDate = new Date(new Date().getFullYear(), 0, 1);
    const endDate = new Date(new Date().getFullYear(), 12 / props.frequency || 0, 0);

    useEffect(() => {
        setFrequency(props.periods[props.periodSelected].frequency);
    }, [props.periodSelected]);

    const accordionSummaryStyle = {
        backgroundColor: "primary.main",
        color: 'white',
    }

    const handleAddFeed = (index: number, fecha: {nit: number, date: Dayjs}) => {
        const nit = fecha.nit;
        const date = new Date(fecha.date.toDate());

        const newFeed = { nit, fecha: date }
        const newFeeds = [...props.feeds];
        //@ts-ignore
        newFeeds[index].fechas.push(newFeed);
        // organize feeds by date
        newFeeds[index].fechas.sort((a, b) => { return a.fecha.getTime() - b.fecha.getTime() });

        props.setFeeds(newFeeds);
    }

    const handleDeletFeed = (index: number, index1: number) => {
        const newFeeds = [...props.feeds];
        newFeeds[index].fechas.splice(index1, 1);

        props.setFeeds(newFeeds);
    }
    
    return (
        <Box width='100%' marginTop={10} display='flex' flexDirection={'column'} alignItems='center' >
            {
                props.feeds.map((feed, index) => {
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
                                    feed.fechas.map((fecha, index1: number) => (
                                        <TableRow key={index1}>
                                            <TableCell>{fecha.nit}</TableCell>
                                            <TableCell>{fecha.fecha.toDateString()}</TableCell>
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
