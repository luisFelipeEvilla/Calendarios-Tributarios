import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Box } from "@mui/material";
import { es } from "date-fns/locale";
import { useEffect } from "react";

type PropsType = { impuestos: any[], impuestosCliente: any[] }
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
    )

}