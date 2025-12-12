"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { tiposPersona, periods, taxTypes } from "../../config";
import { Departamento, Municipio, nuevoImpuesto } from "../../types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaxFormProps {
  impuesto: nuevoImpuesto;
  setImpuesto: (impuesto: nuevoImpuesto) => void;
}

export default function TaxForm({ impuesto, setImpuesto }: TaxFormProps) {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [allMunicipios, setAllMunicipios] = useState<Municipio[]>([]);
  const [periodo, setPeriodo] = useState<number>(0);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      const response = await axios.get(`/api/departamento`);
      setDepartamentos(response.data);
    };

    const fetchMunicipios = async () => {
      const response = await axios.get(`/api/municipio`);
      setMunicipios(response.data);
      setAllMunicipios(response.data);
    };

    fetchDepartamentos();
    fetchMunicipios();

    const periodoValue =
      periods.find((p) => p.value === impuesto.frecuencia)?.value || 0;
    setPeriodo(periodoValue);
  }, []);

  const handlePeriodChange = (value: string) => {
    const periodsNumber = parseInt(value);
    setPeriodo(periodsNumber);

    const periodConfig = periods.find((p) => p.value === periodsNumber);
    const frequency = periodConfig?.frequency || 0;

    const cuotas = [];
    for (let i = 0; i < frequency; i++) {
      cuotas.push({ fechas_presentacion: [] });
    }

    // @ts-ignore
    setImpuesto({ ...impuesto, frecuencia: periodsNumber, cuotas });
  };

  const handleNumeroCuotasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeroCuotas = parseInt(e.target.value) || 0;

    const cuotas = [];
    for (let i = 0; i < numeroCuotas; i++) {
      cuotas.push({ fechas_presentacion: [] });
    }

    // @ts-ignore
    setImpuesto({ ...impuesto, cuotas });
  };

  const handleDepartamentoChange = (value: string) => {
    const departamentoCode = parseInt(value);
    // @ts-ignore
    setImpuesto({ ...impuesto, departamento: departamentoCode });

    const nuevosMunicipios = allMunicipios.filter(
      (municipio) => municipio.codigo_departamento === departamentoCode
    );
    setMunicipios(nuevosMunicipios);
  };

  const handleTaxTypeChange = (value: string) => {
    const taxType = parseInt(value);
    setImpuesto({ ...impuesto, tipo: taxType });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 p-6">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          type="text"
          value={impuesto.nombre}
          onChange={(e) => setImpuesto({ ...impuesto, nombre: e.target.value })}
          autoFocus
        />
      </div>

      {/* Vigencia */}
      <div className="space-y-2">
        <Label>Vigencia</Label>
        <Select
          value={impuesto.vigencia?.toString()}
          onValueChange={(value) =>
            setImpuesto({ ...impuesto, vigencia: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione vigencia" />
          </SelectTrigger>
          <SelectContent>
            {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Aplica a */}
      <div className="space-y-2">
        <Label>Aplica a</Label>
        <Select
          value={impuesto.persona?.toString()}
          onValueChange={(value) =>
            setImpuesto({ ...impuesto, persona: parseInt(value) })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo de persona" />
          </SelectTrigger>
          <SelectContent>
            {tiposPersona.map((tipo) => (
              <SelectItem key={tipo.value} value={tipo.value.toString()}>
                {tipo.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Número de dígitos */}
      <div className="space-y-2">
        <Label htmlFor="numero_digitos">Número de dígitos</Label>
        <Input
          id="numero_digitos"
          type="number"
          value={impuesto.numero_digitos}
          onChange={(e) =>
            setImpuesto({
              ...impuesto,
              numero_digitos: parseInt(e.target.value) || 0,
            })
          }
        />
      </div>

      {/* Frecuencia */}
      <div className="space-y-2">
        <Label>Frecuencia</Label>
        <Select value={periodo.toString()} onValueChange={handlePeriodChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccione frecuencia" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.value} value={p.value.toString()}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Número de Cuotas (solo si periodo == 7) */}
      {periodo === 7 && (
        <div className="space-y-2">
          <Label htmlFor="numero_cuotas">Número de Cuotas</Label>
          <Input
            id="numero_cuotas"
            type="number"
            value={impuesto.cuotas.length}
            onChange={handleNumeroCuotasChange}
          />
        </div>
      )}

      {/* Tipo de impuesto */}
      <div className="space-y-2">
        <Label>Tipo de impuesto</Label>
        <Select
          value={impuesto.tipo?.toString()}
          onValueChange={handleTaxTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione tipo de impuesto" />
          </SelectTrigger>
          <SelectContent>
            {taxTypes.map((type) => (
              <SelectItem key={type.value} value={type.value.toString()}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Departamento (solo si tipo != 1) */}
      {impuesto.tipo !== 1 && (
        <div className="space-y-2">
          <Label>Departamento</Label>
          <Select
            value={impuesto.departamento?.toString() || "0"}
            onValueChange={handleDepartamentoChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Selecciona un departamento</SelectItem>
              {departamentos.map((dep, index) => (
                <SelectItem
                  key={index}
                  value={dep.codigo_departamento.toString()}
                >
                  {dep.departamento}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Municipio (solo si tipo === 3) */}
      {impuesto.tipo === 3 && (
        <div className="space-y-2">
          <Label>Municipio</Label>
          <Select
            value={impuesto.municipio?.toString() || "0"}
            onValueChange={(value) =>
              setImpuesto({ ...impuesto, municipio: parseInt(value) as never })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un municipio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Selecciona un municipio</SelectItem>
              {municipios.map((mun, index) => (
                <SelectItem key={index} value={mun.codigo_municipio.toString()}>
                  {mun.municipio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
