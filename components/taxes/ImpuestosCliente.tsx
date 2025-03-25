import { Box, FormControl, InputLabel, Select, MenuItem, Button, Table, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { taxTypes } from "../../config"
import { FiltersContext } from "../../contexts/FiltersContext"

export default function ImpuestosCliente({ ...props }) {
    const[impuestos, setImpuestos] = useState<any>([])

    const [tipoImpuesto, setTipoImpuesto] = useState<any>(1)
    const [impuestoSeleccionado, setImpuestoSeleccionado] = useState<any>(null)

    const { year, setYear } = useContext(FiltersContext);

    useEffect(() => {
        // filtrar impuestos por tipo
        const newImpuestos = props.impuestos.filter((impuesto: any) => impuesto.tipo == tipoImpuesto)

        setImpuestos(newImpuestos);
    }, [props.impuestos, tipoImpuesto])


    console.log("impuestos cliente", props.impuestosCliente)

    return (
        <Box className='container' sx={{ flexDirection: 'column', alignItems: 'center' }}>
            <Box component='form' onSubmit={props.handleAddTax} sx={{ display: 'flex', gap: 4, marginTop: 2, marginBottom: 4 }}>
                <FormControl sx={{ width: 200 }}>
                    <InputLabel>Tipo de Impuesto</InputLabel>
                    <Select label='Tipo de Impuesto' name='tipo' value={tipoImpuesto} onChange={e => setTipoImpuesto(e.target.value)} >
                        {
                            taxTypes.map((taxType) => (
                                <MenuItem key={taxType.value} value={taxType.value}
                                >{taxType.name}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                <FormControl sx={{ width: 100}}>
                    <InputLabel id='vigencia'>Vigencia</InputLabel>
                    <Select label='vigencia' name='vigencia'
                        value={year}
                        onChange={e => setYear(e.target.value as number)}                    
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

                <FormControl sx={{ width: 300 }}>
                    <InputLabel>Agregar Impuesto</InputLabel>
                    <Select label='Impuestos Nacionales' name={'impuesto'} value={impuestoSeleccionado} onChange={e => setImpuestoSeleccionado(e.target.value)}  >
                        {
                            impuestos.map((tax: any, index: number) => {
                                return <MenuItem key={index} value={tax.id}>{tax.nombre}
                                </MenuItem>
                            })
                        }
                    </Select>
                </FormControl>
                <Button type='submit' color='success' variant='contained'>Agregar</Button>
            </Box>

            <Box component={Paper} sx={{ marginBottom: 5, width: 800 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Impuesto</TableCell>
                            <TableCell>Cuotas</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.impuestosCliente.map((tax: any, index: number) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell>{tax.nombre}</TableCell>
                                        <TableCell> {tax.cuotas.length}</TableCell>
                                        <TableCell>
                                            <Button color='error' variant='contained' onClick={e => props.handleDeleteTax(tax.id)}>Eliminar</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </Box>
        </Box>
    )
}