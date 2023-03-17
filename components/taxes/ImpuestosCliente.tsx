import { Box, FormControl, InputLabel, Select, MenuItem, Button, Table, Paper, TableHead, TableRow, TableCell, TableBody } from "@mui/material"

export default function ImpuestosCliente({ ...props}) {
    return (
        <Box className='container'  sx={{flexDirection: 'column', alignItems: 'center'}}>
            <Box component='form' onSubmit={props.handleAddTax} sx={{ display: 'flex', gap: 4, marginTop: 2, marginBottom: 4 }}>
                <FormControl sx={{ width: 200 }}>
                    <InputLabel>Agregar Impuesto</InputLabel>
                    <Select label='Agregar Impuesto' >
                        {
                            props.impuestos.map((tax: any, index: number) => {
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