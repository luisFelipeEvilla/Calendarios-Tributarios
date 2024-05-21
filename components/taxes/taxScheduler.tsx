import { Scheduler, useScheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Box } from "@mui/material";
import { es } from "date-fns/locale";
import { useEffect } from "react";
import { cuota } from "../../types";

type PropsType = { cuotas: cuota[] }

export default function TaxScheduler({ ...props }: PropsType) {
    const { setEvents } = useScheduler();

    useEffect(() => {
        const updateSchedule = () => {
            const events: ProcessedEvent[] = [];
            props.cuotas.forEach((feed, index) => {
                feed.fechas_presentacion.forEach((fecha) => {
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
    }, [props.cuotas])

    return (
        <Box width='80%' marginBottom={10}>
            <Scheduler locale={es} view='month' events={[]} editable={false} deletable={false} draggable={false} />
        </Box>
    )
}