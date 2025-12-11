"use client";

import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AuthContext } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  FileDown,
  CalendarIcon,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Impuesto {
  id: number;
  nombre: string;
  fecha_limite: Date;
  fecha_presentacion: Date | null;
  fecha_pago: Date | null;
}

interface TablaGestionImpuestosProps {
  idCliente: any;
  impuestos: Impuesto[];
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function TablaGestionImpuestos({
  idCliente,
  impuestos,
}: TablaGestionImpuestosProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Impuesto;
    direction: "asc" | "desc";
  }>({ key: "fecha_limite", direction: "asc" });
  const [editingCell, setEditingCell] = useState<{
    id: number;
    field: "fecha_presentacion" | "fecha_pago";
  } | null>(null);

  const isCliente = user?.rol?.nombre?.toLowerCase().includes("cliente");

  // Filtrar por mes y año
  const impuestosFiltrados = useMemo(() => {
    return impuestos.filter((imp) => {
      const fecha = imp.fecha_limite;
      return (
        fecha.getMonth() === mesSeleccionado &&
        fecha.getFullYear() === añoSeleccionado
      );
    });
  }, [impuestos, mesSeleccionado, añoSeleccionado]);

  // Ordenar
  const impuestosOrdenados = useMemo(() => {
    const sorted = [...impuestosFiltrados].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [impuestosFiltrados, sortConfig]);

  const handleSort = (key: keyof Impuesto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const formatearFecha = (fecha: Date | null) => {
    if (!fecha) return "No Reportada";
    return format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  const handleDateChange = async (
    impuestoId: number,
    field: "fecha_presentacion" | "fecha_pago",
    date: Date | undefined
  ) => {
    if (isCliente || !date) return;

    const impuesto = impuestos.find((imp) => imp.id === impuestoId);
    if (!impuesto) return;

    const updatedImpuesto = { ...impuesto, [field]: date };

    try {
      await axios.put(
        `/api/client/${idCliente}/gestionTributaria/${impuestoId}`,
        updatedImpuesto
      );
      // Update local state
      impuesto[field] = date;
      setEditingCell(null);
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const añosDisponibles = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  }, []);

  const isVencido = (imp: Impuesto) =>
    imp.fecha_limite < new Date() && !imp.fecha_presentacion;

  const SortIcon = ({ columnKey }: { columnKey: keyof Impuesto }) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 h-3 w-3" />
    ) : (
      <ChevronDown className="ml-1 h-3 w-3" />
    );
  };

  return (
    <div className="flex flex-col w-full max-w-5xl space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Select
            value={mesSeleccionado.toString()}
            onValueChange={(v) => setMesSeleccionado(parseInt(v))}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((mes, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {mes}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={añoSeleccionado.toString()}
            onValueChange={(v) => setAñoSeleccionado(parseInt(v))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {añosDisponibles.map((año) => (
                <SelectItem key={año} value={año.toString()}>
                  {año}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() =>
            router.push(`/cliente/${idCliente}/gestionTributaria/pdf?vigencia=${añoSeleccionado}`)
          }
          className="gap-2"
        >
          <FileDown className="h-4 w-4" />
          Descargar Informe
        </Button>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("nombre")}
              >
                <div className="flex items-center justify-center">
                  Nombre
                  <SortIcon columnKey="nombre" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => handleSort("fecha_limite")}
              >
                <div className="flex items-center justify-center">
                  Fecha de Vencimiento
                  <SortIcon columnKey="fecha_limite" />
                </div>
              </TableHead>
              <TableHead className="text-center">Fecha de Presentación</TableHead>
              <TableHead className="text-center">Fecha de Pago</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {impuestosOrdenados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No hay impuestos para este período
                </TableCell>
              </TableRow>
            ) : (
              impuestosOrdenados.map((impuesto) => (
                <TableRow
                  key={impuesto.id}
                  className={cn(isVencido(impuesto) && "bg-red-50")}
                >
                  <TableCell className="text-center font-medium">
                    {impuesto.nombre}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-center",
                      isVencido(impuesto) && "text-red-600 font-medium"
                    )}
                  >
                    {formatearFecha(impuesto.fecha_limite)}
                  </TableCell>

                  {/* Fecha Presentación - Editable */}
                  <TableCell className="text-center">
                    {isCliente ? (
                      <span
                        className={cn(
                          !impuesto.fecha_presentacion && "text-muted-foreground"
                        )}
                      >
                        {formatearFecha(impuesto.fecha_presentacion)}
                      </span>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 justify-center text-sm font-normal",
                              !impuesto.fecha_presentacion && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {formatearFecha(impuesto.fecha_presentacion)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Calendar
                            mode="single"
                            selected={impuesto.fecha_presentacion || undefined}
                            onSelect={(date) =>
                              handleDateChange(impuesto.id, "fecha_presentacion", date)
                            }
                            locale={es}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>

                  {/* Fecha Pago - Editable */}
                  <TableCell className="text-center">
                    {isCliente ? (
                      <span
                        className={cn(
                          !impuesto.fecha_pago && "text-muted-foreground"
                        )}
                      >
                        {formatearFecha(impuesto.fecha_pago)}
                      </span>
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "h-8 justify-center text-sm font-normal",
                              !impuesto.fecha_pago && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            {formatearFecha(impuesto.fecha_pago)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="center">
                          <Calendar
                            mode="single"
                            selected={impuesto.fecha_pago || undefined}
                            onSelect={(date) =>
                              handleDateChange(impuesto.id, "fecha_pago", date)
                            }
                            locale={es}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Contador */}
      <div className="text-sm text-muted-foreground">
        Mostrando {impuestosOrdenados.length} de {impuestos.length} impuestos
      </div>
    </div>
  );
}