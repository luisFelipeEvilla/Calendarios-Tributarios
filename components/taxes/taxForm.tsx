import { Box, FormControl, TextField, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { personTypes, periods, taxTypes } from "../../config";

import styles from '../../styles/calendarioTributario/create.module.css';
import { Departamento, Feed, Municipio } from "../../types";

type PropsType = {
    name: string, setName: (number: any) => void,
    applyTo: number, setApplyTo: (applyTo: any) => void,
    period: number, setPeriod: (period: number) => void,
    taxType: number, setTaxType: (taxType: number) => void,
    departamento: number, setDepartamento: (departamento: number) => void,
    municipio: number, setMunicipio: (municipio: number) => void,
    feeds: Feed[], setFeeds: (feeds: Feed[]) => void,
    departamentos: Departamento[], 
    municipios: Municipio[], setMunicipios: (municipios: Municipio[]) => void
}


export default function ({ ...props }: PropsType) {
    const handlePeriodChange = (event: SelectChangeEvent<unknown>) => {
        const periodsNumber = event.target.value as number;
        props.setPeriod(periodsNumber);

        const frequency = periods.find(periodo => periodo.value === periodsNumber)?.frequency || 0;

        const newFeeds = [];

        for (let i = 0; i < frequency; i++) {
            newFeeds.push([]);
        }

        // @ts-ignore
        setFeeds(newFeeds);
    }

    const handledDepartamentoChange = (event: SelectChangeEvent<unknown>) => {
        const departamentoCode = event.target.value as number;
        props.setDepartamento(departamentoCode);
        const municipios = props.departamentos.find(departamento => departamento.codigo_departamento === departamentoCode)?.municipios || [];
        props.setMunicipios(municipios);
    }

    const handleTaxTypeChange = (event: SelectChangeEvent<unknown>) => {
        const taxType = event.target.value as number;
        props.setTaxType(taxType);
        props.setDepartamento(0);
        props.setMunicipio(0);
    }  

    return (
        <Box className={`${styles.container} ${styles.formContainer}`}>
            <FormControl fullWidth>
                <TextField
                    id="name"
                    type={'text'}
                    label="Nombre"
                    name="name"
                    value={props.name}
                    onChange={(e) => props.setName(e.target.value)}
                    autoFocus
                />
            </FormControl>
            <FormControl fullWidth>
                <InputLabel sx={{ fontSize: 20 }} >Aplica a</InputLabel>
                <Select name='Aplica' value={props.applyTo} fullWidth label='Aplica a' onChange={e => props.setApplyTo(e.target.value as number)}>
                    {
                        personTypes.map((taxType) => (
                            <MenuItem key={taxType.value} value={taxType.value}
                            >{taxType.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel sx={{ fontSize: 20 }}> Frecuencia</InputLabel>
                <Select name='Periodicidad' value={props.period} fullWidth label='frecuencia' onChange={handlePeriodChange}>
                    {
                        periods.map((periodo) => (
                            <MenuItem key={periodo.value} value={periodo.value}
                            >{periodo.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel sx={{ fontSize: 20 }} >Tipo de impuesto</InputLabel>
                <Select name='Tipo de impuesto' value={props.taxType} fullWidth label='Tipo de impuesto' onChange={handleTaxTypeChange}>
                    {
                        taxTypes.map((taxType) => (
                            <MenuItem key={taxType.value} value={taxType.value}
                            >{taxType.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            {
                props.taxType != 1 ?
                    <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: 20 }}>Ubicación</InputLabel>
                        <Select name="departamento" value={props.departamento} onChange={handledDepartamentoChange} required>
                            <MenuItem value={0}>Selecciona un departamento</MenuItem>
                            {
                                props.departamentos.map((departamento, index) => <MenuItem value={departamento.codigo_departamento} key={index}>{departamento.departamento}</MenuItem>)
                            }
                        </Select>
                    </FormControl> : null
            }
            {
                props.taxType === 3 ?
                    <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: 20 }}>Municipio</InputLabel>
                        <Select name="municipio" value={props.municipio} onChange={e => props.setMunicipio(e.target.value as number)} required>
                            <MenuItem value={0}>Selecciona un municipio</MenuItem>
                            {
                                props.municipios.map((municipio, index) => <MenuItem value={municipio.codigo_municipio} key={index}>{municipio.municipio}</MenuItem>)
                            }
                        </Select>
                    </FormControl> : null
            }
        </Box>
    )
}