import { nuevo_impuesto, Prisma } from "@prisma/client"

export type Municipio = { codigo_departamento: number, codigo_municipio: number, municipio: string };
export type Departamento = { codigo_departamento: number, departamento: string, municipios: Municipio[] };

export type fechas_presentacion = { id: number, fecha: Date, cuota: number };

// type cuotas with relatuionship
export type cuota = Prisma.cuotasGetPayload<{ include: { fechas_presentacion: true } }>

// type nuevoImpuesto with relatuionship
export type nuevoImpuesto = Prisma.nuevo_impuestoGetPayload<{ include: { departamento: true, municipio: true, cuotas: { include: { fechas_presentacion: true}} } }>
