"use client";

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Evento {
  id: string;
  title: string;
  fecha: Date;
}

interface TaxesSchedulerProps {
  events?: Evento[];
  onEventsChange?: (events: Evento[]) => void;
}

const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export default function TaxesScheduler({
  events: initialEvents = [],
  onEventsChange,
}: TaxesSchedulerProps) {
  const [mesActual, setMesActual] = useState(new Date());
  const [eventos, setEventos] = useState<Evento[]>(initialEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [digitoVerificacion, setDigitoVerificacion] = useState("");
  const [error, setError] = useState("");

  const getEventosDelDia = (dia: Date) => {
    return eventos.filter((evento) => isSameDay(evento.fecha, dia));
  };

  const handleDayClick = (dia: Date) => {
    setSelectedDate(dia);
    setEditingEvent(null);
    setDigitoVerificacion("");
    setError("");
    setDialogOpen(true);
  };

  const handleEventClick = (evento: Evento, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDate(evento.fecha);
    setEditingEvent(evento);
    setDigitoVerificacion(evento.title);
    setError("");
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    const digit = parseInt(digitoVerificacion);

    if (isNaN(digit) || digit < 0) {
      setError("Debe ingresar un número válido");
      return;
    }

    let nuevosEventos: Evento[];

    if (editingEvent) {
      nuevosEventos = eventos.map((ev) =>
        ev.id === editingEvent.id ? { ...ev, title: digitoVerificacion } : ev
      );
    } else {
      const nuevoEvento: Evento = {
        id: Math.random().toString(),
        title: digitoVerificacion,
        fecha: selectedDate!,
      };
      nuevosEventos = [...eventos, nuevoEvento];
    }

    setEventos(nuevosEventos);
    onEventsChange?.(nuevosEventos);
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (editingEvent) {
      const nuevosEventos = eventos.filter((ev) => ev.id !== editingEvent.id);
      setEventos(nuevosEventos);
      onEventsChange?.(nuevosEventos);
      setDialogOpen(false);
    }
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
          onClick={() => handleDayClick(diaActual)}
          className={cn(
            "min-h-[100px] p-1 border-b border-r border-border cursor-pointer hover:bg-muted/50 transition-colors",
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
            {eventosDelDia.slice(0, 3).map((evento) => (
              <TooltipProvider key={evento.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onClick={(e) => handleEventClick(evento, e)}
                      className="text-xs px-1.5 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80 transition-opacity bg-indigo-500"
                    >
                      Dígito: {evento.title}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">
                      Número de verificación: {evento.title}
                    </p>
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
    <>
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

      {/* Dialog para agregar/editar evento */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Editar" : "Agregar"} dígito de verificación
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {selectedDate &&
                format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
            </p>
            <div className="space-y-2">
              <Label htmlFor="digito">Dígito de verificación</Label>
              <Input
                id="digito"
                type="number"
                value={digitoVerificacion}
                onChange={(e) => {
                  setDigitoVerificacion(e.target.value);
                  setError("");
                }}
                placeholder="Ingrese el dígito"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter className="gap-2">
            {editingEvent && (
              <Button variant="destructive" onClick={handleDelete}>
                <X className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
