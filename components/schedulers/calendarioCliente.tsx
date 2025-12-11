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

interface CalendarioClienteProps {
  impuestosCliente: any[];
}

interface ImpuestoCliente {
  nombre: string;
  tipo: number;
  cuotas: { id: number; nombre: string; fecha: Date }[];
}

interface Evento {
  id: string;
  nombre: string;
  fecha: Date;
  color: string;
  tipo: string;
}

const COLORES = {
  nacionales: { bg: "bg-blue-500", text: "text-blue-500", dot: "bg-blue-500" },
  departamentales: { bg: "bg-pink-500", text: "text-pink-500", dot: "bg-pink-500" },
  municipales: { bg: "bg-orange-500", text: "text-orange-500", dot: "bg-orange-500" },
  seguridadSocial: { bg: "bg-purple-500", text: "text-purple-500", dot: "bg-purple-500" },
};

const TIPOS_IMPUESTO = ["nacionales", "departamentales", "municipales", "seguridadSocial"] as const;

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function CalendarioCliente({ impuestosCliente }: CalendarioClienteProps) {
  const [mesActual, setMesActual] = useState(new Date());

  const eventos: Evento[] = useMemo(() => {
    const eventsList: Evento[] = [];
    impuestosCliente.forEach((impuesto: ImpuestoCliente, index: number) => {
      let tipoIndex = impuesto.tipo - 1;
      if (impuesto.nombre.toLowerCase().includes("seguridad social")) tipoIndex = 3;
      const tipo = TIPOS_IMPUESTO[tipoIndex] || "nacionales";

      impuesto.cuotas.forEach((cuota: any, cuotaIndex: number) => {
        const fecha = new Date(cuota.fecha);
        fecha.setDate(fecha.getDate() + 1);
        eventsList.push({
          id: `${index}-${cuotaIndex}`,
          nombre: impuesto.nombre,
          fecha,
          color: tipo,
          tipo,
        });
      });
    });
    return eventsList;
  }, [impuestosCliente]);

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
            "min-h-[100px] p-1 border-b border-r border-border",
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

          <div className="space-y-1">
            {eventosDelDia.slice(0, 3).map((evento) => {
              const colorConfig = COLORES[evento.tipo as keyof typeof COLORES];
              return (
                <TooltipProvider key={evento.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "text-xs px-1.5 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80 transition-opacity",
                          colorConfig.bg
                        )}
                      >
                        {evento.nombre}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{evento.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(evento.fecha, "d 'de' MMMM 'de' yyyy", { locale: es })}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
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
    <div className="w-full max-w-5xl bg-card rounded-lg border shadow-sm">
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

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 p-3 border-b bg-muted/30">
        <div className="flex items-center gap-1.5">
          <span className={cn("w-3 h-3 rounded-full", COLORES.nacionales.dot)} />
          <span className="text-xs">Nacionales</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("w-3 h-3 rounded-full", COLORES.departamentales.dot)} />
          <span className="text-xs">Departamentales</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("w-3 h-3 rounded-full", COLORES.municipales.dot)} />
          <span className="text-xs">Municipales</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("w-3 h-3 rounded-full", COLORES.seguridadSocial.dot)} />
          <span className="text-xs">Seguridad Social</span>
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