import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

type PropsType = { impuestos: any[], impuestosCliente: any[], handleAddTax: any, handleDeleteTax: any}
type ImpuestoCliente = { nombre: string, cuotas: { fecha_limite: Date }[] };
export default function CalendarioCliente({ ...props }: PropsType) {
    const { events, setEvents } = useScheduler();

    useEffect(() => {
        updateScheduler();
    }, [props.impuestosCliente])

    const updateScheduler = () => {
        setEvents([]);
        const events: ProcessedEvent[] = [];
        props.impuestosCliente.forEach((impuesto: ImpuestoCliente, index: number) => {
            impuesto.cuotas.forEach((cuota: any) => {
                const startDate = new Date(cuota.fecha);
                startDate.setDate(startDate.getDate() + 1);
                events.push({
                    event_id: index,
                    title: impuesto.nombre,
                    start: startDate,
                    end: startDate,
                    color: '#3f51b5',
                    textColor: '#fff',
                    allDay: true,
                })
            });
        })
        setEvents(events);
    };

    return (
        <Box className='container' justifyContent={'center'} flexDirection='column' alignItems={'center'} marginTop={5}>
            <Box width={800} marginTop={5} marginBottom={5}>
                <Scheduler month={
                    {
                        weekDays: [1, 2, 3, 4, 5],
                        weekStartOn: 0,
                        startHour: 9,
                        endHour: 17,
                    }
                } events={events} locale={es} view="month"></Scheduler>
            </Box>

            <Box component='form' onSubmit={props.handleAddTax} sx={{ display: 'flex', gap: 4, marginTop: 2, marginBottom: 4 }}>
                <FormControl sx={{ width: 200 }}>
                    <InputLabel>Agregar Impuesto</InputLabel>
                    <Select label='Agregar Impuesto' >
                        {
                            props.impuestos.map((tax: any, index: number) => {
                                return <MenuItem key={index} value={tax.id}>{tax.nombre}
                                </MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <Button type='submit' color='success' variant='contained'>Agregar</Button>
            </Box>

            <Box sx={{ marginBottom: 5, width: 800 }}>
                <Table component={Paper}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Impuesto</TableCell>
                            <TableCell>Cuotas</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.impuestosCliente.map((tax: any, index: number) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{tax.nombre}</TableCell>
                                        <TableCell> {tax.cuotas.length}</TableCell>
                                        <TableCell>
                                            <Button color='error' variant='contained' onClick={e => props.handleDeleteTax(tax.id)}>Eliminar</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )

}