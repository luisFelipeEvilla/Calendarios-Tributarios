"use client";

import React, { useMemo, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cuota } from "../../types";

interface PropsType {
  cuotas: cuota[];
}

interface Evento {
  id: string;
  nit: string;
  fecha: Date;
}

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function TaxScheduler({ cuotas }: PropsType) {
  const [mesActual, setMesActual] = useState(new Date());

  const eventos: Evento[] = useMemo(() => {
    const eventsList: Evento[] = [];
    cuotas.forEach((feed, index) => {
      feed.fechas_presentacion.forEach((fecha: any) => {
        const fechaDate =
          typeof fecha.fecha === "string" ? new Date(fecha.fecha) : fecha.fecha;
        eventsList.push({
          id: `${index}-${fecha.nit}`,
          nit: `${fecha.nit}`,
          fecha: fechaDate,
        });
      });
    });
    return eventsList;
  }, [cuotas]);

  const getEventosDelDia = (dia: Date) => {
    return eventos.filter((evento) => isSameDay(evento.fecha, dia));
  };

  const renderCalendario = () => {
    const inicioMes = startOfMonth(mesActual);
    const finMes = endOfMonth(mesActual);
    const inicioCalendario = startOfWeek(inicioMes, { weekStartsOn: 0 });
    const finCalendario = endOfWeek(finMes, { weekStartsOn: 0 });

    const dias: React.ReactNode[] = [];
    let dia = inicioCalendario;

    while (dia <= finCalendario) {
      const diaActual = dia;
      const eventosDelDia = getEventosDelDia(diaActual);
      const esHoy = isSameDay(dia, new Date());
      const esMesActual = isSameMonth(dia, mesActual);

      dias.push(
        <div
          key={dia.toString()}
          className={cn(
            "min-h-[80px] p-1 border-b border-r border-border",
            !esMesActual && "bg-muted/30",
            esHoy && "bg-primary/5"
          )}
        >
          <div
            className={cn(
              "text-sm font-medium mb-1",
              !esMesActual && "text-muted-foreground",
              esHoy && "text-primary font-bold"
            )}
          >
            <span
              className={cn(
                "inline-flex items-center justify-center w-7 h-7 rounded-full",
                esHoy && "bg-primary text-primary-foreground"
              )}
            >
              {format(dia, "d")}
            </span>
          </div>

          <div className="space-y-0.5">
            {eventosDelDia.slice(0, 3).map((evento) => (
              <TooltipProvider key={evento.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-xs px-1.5 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80 transition-opacity bg-indigo-500">
                      NIT: {evento.nit}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">NIT: {evento.nit}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(evento.fecha, "d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {eventosDelDia.length > 3 && (
              <div className="text-xs text-muted-foreground px-1">
                +{eventosDelDia.length - 3} más
              </div>
            )}
          </div>
        </div>
      );

      dia = addDays(dia, 1);
    }

    return dias;
  };

  return (
    <div className="w-[80%] mb-10 bg-card rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {format(mesActual, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMesActual(subMonths(mesActual, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMesActual(new Date())}
          >
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMesActual(addMonths(mesActual, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 border-b">
        {DIAS_SEMANA.map((dia) => (
          <div
            key={dia}
            className="p-2 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7">{renderCalendario()}</div>
    </div>
  );
}
