
export type Fecha = {id: number,  nit: number, cuota: number, fecha: Date}
export type Feed = {id: number, number: number, tax: number, fechas: Fecha[] };

export type Municipio = { codigo_departamento: number, codigo_municipio: number, municipio: string };
export type Departamento = { codigo_departamento: number, departamento: string, municipios: Municipio[] };

export type Cuota = { nit: number, date: Date };