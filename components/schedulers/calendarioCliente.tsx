import { Scheduler } from "@aldabil/react-scheduler";
import { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { Box } from "@mui/material";
import { es } from "date-fns/locale";
import { useMemo } from "react";

type PropsType = { impuestosCliente: any[] }
type ImpuestoCliente = { nombre: string, tipo: number, cuotas: { fecha_limite: Date }[] };

export default function CalendarioCliente({ ...props }: PropsType) {
    const colores = [
        // nacionales
        '#3f51b5',
        // departamentales
        '#f50057',
        // municipales
        '#ff9800',
        // seguridad social
        '#9a6ce2'
    ]

    const events: ProcessedEvent[] = useMemo(() => {
        const eventsList: ProcessedEvent[] = [];
        props.impuestosCliente.forEach((impuesto: ImpuestoCliente, index: number) => {
            let color = colores[impuesto.tipo - 1];
            if (impuesto.nombre.toLowerCase().includes('seguridad social')) color = colores[3];
            impuesto.cuotas.forEach((cuota: any, cuotaIndex: number) => {
                const startDate = new Date(cuota.fecha);
                startDate.setDate(startDate.getDate() + 1);
                eventsList.push({
                    event_id: `${index}-${cuotaIndex}`,
                    title: impuesto.nombre,
                    start: startDate,
                    end: startDate,
                    color,
                    textColor: '#fff',
                    allDay: true,
                })
            });
        })
        return eventsList;
    }, [props.impuestosCliente])

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