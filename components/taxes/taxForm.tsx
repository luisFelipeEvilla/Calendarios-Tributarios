import { Box, FormControl, TextField, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { tiposPersona, periods, taxTypes } from "../../config";
import styles from '../../styles/calendarioTributario/create.module.css';
import { Departamento, Municipio, nuevoImpuesto } from "../../types";

type PropsType = {
    impuesto: nuevoImpuesto,
    setImpuesto: (impuesto: nuevoImpuesto) => void,
}

export default function TaxForm({ ...props }: PropsType) {
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [municipios, setMunicipios] = useState<Municipio[]>([]);
    const [periodo, setPeriodo] = useState<number>(0);

    useEffect(() => {
        const fetchDepartamentos = async () => {
            const departamentos = await axios.get(`/api/departamento`);
            setDepartamentos(departamentos.data);
        }

        const fetchMunicipios = async () => {
            const municipios = await axios.get(`/api/municipio`);
            setMunicipios(municipios.data);
        }

        fetchDepartamentos();
        fetchMunicipios();
        
        const periodo = periods.find(periodo => periodo.value === props.impuesto.frecuencia)?.value || 0;
        setPeriodo(periodo);
    },[])

    const handlePeriodChange = (event: SelectChangeEvent<unknown>) => {
        const periodsNumber = event.target.value as number;
        setPeriodo(periodsNumber);

        const { value, frequency} = periods.find(periodo => periodo.value === periodsNumber) || {value: 0, frequency: 0};
    
        const cuotas = [];

        for (let i = 0; i < frequency ; i++) {
            cuotas.push({fechas_presentacion: []});
        }

        // @ts-ignore
        props.setImpuesto({ ...props.impuesto, frecuencia: value, cuotas });
    }

    const handleNumeroCuotasChange = (event: any) => {
        const numeroCuotas = event.target.value as number;

        const cuotas = [];

        for (let i = 0; i < numeroCuotas; i++) {
            cuotas.push({fechas_presentacion: []});
        }

        // @ts-ignore
        props.setImpuesto({ ...props.impuesto, cuotas });
    }

    const handledDepartamentoChange = (event: SelectChangeEvent<unknown>) => {
        const departamentoCode = event.target.value as number;
        // @ts-ignore
        props.setImpuesto({ ...props.impuesto, departamento: departamentoCode });
        const nuevosMunicipios = municipios.filter(municipio => municipio.codigo_departamento === departamentoCode)
        setMunicipios(nuevosMunicipios);
    }

    const handleTaxTypeChange = (event: SelectChangeEvent<unknown>) => {
        const taxType = event.target.value as number;
        props.setImpuesto({ ...props.impuesto, tipo: taxType });
    }

    return (
        <Box className={`${styles.container} ${styles.formContainer}`}>
            <FormControl fullWidth>
                <TextField
                    id="name"
                    type={'text'}
                    label="Nombre"
                    name="name"
                    value={props.impuesto.nombre}
                    onChange={(e) => props.setImpuesto({ ...props.impuesto, nombre: e.target.value })}
                    autoFocus
                />
            </FormControl>
            <FormControl fullWidth>
                <InputLabel 
                    id="vigencia"
                    sx={{ fontSize: 20 }}
                >Vigencia</InputLabel>
                <Select 
                    label='vigencia'
                    name='vigencia'
                    value={props.impuesto.vigencia}
                    onChange={e => props.setImpuesto({ ...props.impuesto, vigencia: e.target.value as number})}
                >
                    <MenuItem value={2023}>2023</MenuItem>
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2025}>2025</MenuItem>
                    <MenuItem value={2026}>2026</MenuItem>
                    <MenuItem value={2027}>2027</MenuItem>
                    <MenuItem value={2028}>2028</MenuItem>
                    <MenuItem value={2029}>2029</MenuItem>
                    <MenuItem value={2030}>2030</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel sx={{ fontSize: 20 }} >Aplica a</InputLabel>
                <Select name='Aplica' value={props.impuesto.persona} fullWidth label='Aplica a' onChange={e => props.setImpuesto({ ...props.impuesto, persona: e.target.value as number})}>
                    {
                        tiposPersona.map((taxType) => (
                            <MenuItem key={taxType.value} value={taxType.value}
                            >{taxType.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <TextField 
                    type='number'
                    name='Numero Digitos' 
                    label='Número de digitos'
                    value={props.impuesto.numero_digitos} 
                    fullWidth 
                    onChange={e => props.setImpuesto({ ...props.impuesto, numero_digitos: parseInt(e.target.value)})}/>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel sx={{ fontSize: 20 }}> Frecuencia</InputLabel>
                <Select name='Periodicidad' value={periodo} fullWidth label='frecuencia' onChange={handlePeriodChange}>
                    {
                        periods.map((periodo) => (
                            <MenuItem key={periodo.value} value={periodo.value}
                            >{periodo.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            {
                periodo == 7 ?
                    <FormControl fullWidth>
                        <TextField 
                            type='number'
                            name='Numero Digitos' 
                            label='Número de Cuotas'
                            value={props.impuesto.cuotas.length} 
                            fullWidth 
                            onChange={handleNumeroCuotasChange}/>
                    </FormControl> : null
            }
            <FormControl fullWidth>
                <InputLabel sx={{ fontSize: 20 }} >Tipo de impuesto</InputLabel>
                <Select name='Tipo de impuesto' value={props.impuesto.tipo} fullWidth label='Tipo de impuesto' onChange={handleTaxTypeChange}>
                    {
                        taxTypes.map((taxType) => (
                            <MenuItem key={taxType.value} value={taxType.value}
                            >{taxType.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            {
                props.impuesto.tipo != 1 ?
                    <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: 20 }}>Departamento</InputLabel>
                        <Select name="departamento" label="Departamento" value={props.impuesto.departamento} onChange={handledDepartamentoChange} required>
                            <MenuItem value={0}>Selecciona un departamento</MenuItem>
                            {
                                departamentos.map((departamento, index) => <MenuItem value={departamento.codigo_departamento} key={index}>{departamento.departamento}</MenuItem>)
                            }
                        </Select>
                    </FormControl> : null
            }
            {
                props.impuesto.tipo === 3 ?
                    <FormControl fullWidth>
                        <InputLabel sx={{ fontSize: 20 }}>Municipio</InputLabel>
                        <Select label="Municipio" name="municipio" value={props.impuesto.municipio} onChange={e => props.setImpuesto({ ...props.impuesto, municipio: e.target.value as never})} required>
                            <MenuItem value={0}>Selecciona un municipio</MenuItem>
                            {
                                municipios.map((municipio, index) => <MenuItem value={municipio.codigo_municipio} key={index}>{municipio.municipio}</MenuItem>)
                            }
                        </Select>
                    </FormControl> : null
            }
        </Box>
    )
}