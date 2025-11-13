import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Box } from "@mui/material";
import { es } from "date-fns/locale";
import { useMemo } from "react";
import { cuota } from "../../types";

type PropsType = { cuotas: cuota[] }

export default function TaxScheduler({ ...props }: PropsType) {
    const events: ProcessedEvent[] = useMemo(() => {
        const eventsList: ProcessedEvent[] = [];
        props.cuotas.forEach((feed, index) => {
            feed.fechas_presentacion.forEach((fecha: any) => {
                const fechaDate = typeof fecha.fecha === 'string' ? new Date(fecha.fecha) : fecha.fecha;
                eventsList.push({
                    event_id: `${index}-${fecha.nit}`,
                    title: `${fecha.nit}`,
                    start: fechaDate,
                    end: fechaDate,
                    color: '#3f51b5',
                    textColor: 'white',
                    allDay: true,
                })
            })
        })
        return eventsList;
    }, [props.cuotas])

    return (
        <Box width='80%' marginBottom={10}>
            <Scheduler locale={es} view='month' events={events} editable={false} deletable={false} draggable={false} />
        </Box>
    )
}