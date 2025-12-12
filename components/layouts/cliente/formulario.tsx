"use client";

import axios from "axios";
import { tiposPersona } from "../../../config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormularioClienteProps {
  cliente: any;
  setCliente: (cliente: any) => void;
  setModalOpen: (open: boolean) => void;
  setModalMessage: (message: string) => void;
  setError: (error: boolean) => void;
}

export default function FormularioCliente({
  cliente,
  setCliente,
  setModalOpen,
  setModalMessage,
  setError,
}: FormularioClienteProps) {
  const handleTipoPersonaChange = (value: string) => {
    setCliente({ ...cliente, tipo_persona: parseInt(value) });
  };

  const handleNitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nit = parseInt(e.target.value);
    setCliente({ ...cliente, nit });
  };

  const handleNombreEmpresaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCliente({ ...cliente, nombre_empresa: e.target.value });
  };

  const handlePaginaWebChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, pagina_web: e.target.value });
  };

  const handleEmailNotificacionesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCliente({ ...cliente, email_calendario: e.target.value });
  };

  const handleUpdateCliente = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      const url = `/api/client/${cliente.id}`;

      await axios.put(url, cliente);

      setModalOpen(true);
      setModalMessage("Cliente actualizado correctamente");
      setError(false);
    } catch (error) {
      console.log(error);
      setModalOpen(true);
      setModalMessage("Error al actualizar el cliente");
      setError(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mt-8">
      {/* Información General */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Información General</h2>

        <div className="space-y-2">
          <Label htmlFor="nombre_empresa">Nombre de la empresa</Label>
          <Input
            id="nombre_empresa"
            value={cliente.nombre_empresa || ""}
            onChange={handleNombreEmpresaChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nit">NIT</Label>
          <Input
            id="nit"
            value={cliente.nit || ""}
            onChange={handleNitChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pagina_web">Página web</Label>
          <Input
            id="pagina_web"
            value={cliente.pagina_web || ""}
            onChange={handlePaginaWebChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email_calendario">Email de Notificaciones</Label>
          <Input
            id="email_calendario"
            value={cliente.email_calendario || ""}
            onChange={handleEmailNotificacionesChange}
          />
        </div>
      </div>

      {/* Información Tributaria */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Información Tributaria</h2>

        <div className="space-y-2">
          <Label htmlFor="tipo_persona">Tipo de Persona</Label>
          <Select
            value={cliente.tipo_persona?.toString()}
            onValueChange={handleTipoPersonaChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione tipo de persona" />
            </SelectTrigger>
            <SelectContent>
              {tiposPersona.map((tipo, index) => (
                <SelectItem key={index} value={tipo.value.toString()}>
                  {tipo.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón Actualizar */}
      <div className="md:col-span-2 flex justify-center mt-8">
        <Button
          variant="default"
          className="bg-green-600 hover:bg-green-700"
          onClick={handleUpdateCliente}
        >
          Actualizar
        </Button>
      </div>
    </div>
  );
}
