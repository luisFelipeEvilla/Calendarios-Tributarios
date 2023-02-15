import React, { ReactElement } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';


export default function Table({ ...props }): ReactElement {
    const [pageSize, setPageSize] = React.useState(7);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'nombre', headerName: 'Nombre', width: 300, headerAlign: 'center', align: 'center' },
        { field: 'frecuencia', headerName: 'Frecuencia', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'numero_cuotas', headerName: 'Número de cuotas', width: 200, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.cuotas.length}`,
        },
        {
            field: 'acciones', 
            headerName: 'Acciones', width: 200,
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="primary" size="small" style={{ marginRight: 16 }}>
                        Editar
                    </Button>
                    <Button variant="contained" color="error" size="small">
                        Eliminar
                    </Button>
                </Box>
            ),
        }
    ];


    return (
        <DataGrid
            rows={props.data}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[7, 10, 20]}
            disableSelectionOnClick
        />
    );
}