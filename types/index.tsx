export type Feed = { nit: number, date: Date };

export type Municipio = { codigo_departamento: number, codigo_municipio: number, municipio: string };
export type Departamento = { codigo_departamento: number, departamento: string, municipios: Municipio[] };