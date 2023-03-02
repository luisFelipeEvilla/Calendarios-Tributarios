import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Cuota, Feed } from "../../types";
import FeedForm from "./feedForm";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";

type Period = { name: string, value: number, frequency: number };
type PropsType = {
    periods: Period[], periodSelected: number, feeds: Feed[][], frequency: number,
    handleAddFeed: (index: number, feed: Feed) => void,
    handleDeletFeed: (index: number, index1: number) => void
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

    return (
        <Box width='100%' marginTop={10} display='flex' flexDirection={'column'} alignItems='center' >
            {
                props.feeds.map((tax, index) => {
                    const component = <Accordion sx={{ width: '100%' }} key={index}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}
                            sx={accordionSummaryStyle}
                        >
                            <Typography>Cuota No. {index + 1}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <p><b>Periodo:</b> {initDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
                            <FeedForm index={index} handleAddFeed={props.handleAddFeed} />
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
                                    tax.map((feed: Feed, index1: number) => (
                                        <TableRow key={index1}>
                                            <TableCell>{feed.nit}</TableCell>
                                            <TableCell>{feed.date.toDateString()}</TableCell>
                                            <TableCell><Button onClick={e => props.handleDeletFeed(index, index1)} variant="contained" color="error">Eliminar</Button></TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                                </Table>
                            </TableContainer>
                        </AccordionDetails>

                    </Accordion>


                    initDate.setMonth(initDate.getMonth() + 12 / props.frequency);
                    endDate.setMonth(endDate.getMonth() + 12 / props.frequency + 1, 0);

                    return component;
                })
            }
        </Box>
    )
}
