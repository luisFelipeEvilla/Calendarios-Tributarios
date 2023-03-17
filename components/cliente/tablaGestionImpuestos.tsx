import { Box } from "@mui/material"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

export default function TablaGestionImpuestos({ ...props }) {
    const mensajeFechaNula = 'No Reportada';

    const formatoFecha: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    console.log(props.impuestos)
    const columnas: GridColDef[] = [
        { field: 'nombre', headerName: 'Nombre', flex: 2, headerAlign: 'center', align: 'center' },
        {
            field: 'fecha_limite', headerName: 'Fecha de Vencimiento', flex: 1, headerAlign: 'center', align: 'center',
            type: 'date',
            valueFormatter: (params) => params.value ? params.value.toLocaleDateString('es-co', formatoFecha) : mensajeFechaNula
        },
        {
            field: 'fecha_presentacion', headerName: 'Fecha de Presentacion', flex: 1, headerAlign: 'center', align: 'center',
            type: 'date',
            valueFormatter: (params) => params.value ? params.value.toLocaleDateString('es-co', formatoFecha) : mensajeFechaNula
        },
        {
            field: 'Fecha_pago', headerName: 'Fecha de Pago', flex: 1, headerAlign: 'center', align: 'center',
            type: 'date',
            valueFormatter: (params) => params.value ? params.value.toLocaleDateString('es-co', formatoFecha) : mensajeFechaNula
        },
    ]

    return (
        <Box sx={{ display: 'flex', minHeight: 600, width: 1000 }}>
            <Box sx={{ flexGrow: 1 }}>
                <DataGrid
                    columns={columnas}
                    rows={props.impuestos}
                    initialState={{
                        sorting: {
                            sortModel: [
                                {
                                    field: 'fecha_limite',
                                    sort: 'asc',
                                },
                            ],
                        }
                    }}
                />
            </Box>
        </Box>
    )
}