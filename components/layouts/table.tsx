import React, { ReactElement } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl/FormControl';
import TextField from '@mui/material/TextField/TextField';
import Searchicon from '@mui/icons-material/Search';

export default function Table({ ...props }): ReactElement {
    const [filterData, setFilterData] = React.useState(props.data);
    const [pageSize, setPageSize] = React.useState(7);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredData = props.data.filter((value: any) => {
            return value.nombre.toLowerCase().includes(searchQuery);
        });

        setFilterData(filteredData);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'nombre', headerName: 'Nombre', width: 300, headerAlign: 'center', align: 'center' },
        { field: 'frecuencia', headerName: 'Frecuencia', width: 200, headerAlign: 'center', align: 'center' },
        {
            field: 'numero_cuotas', headerName: 'Número de cuotas', width: 200, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.cuotas.length}`,
        },
        {
            field: 'acciones',
            headerName: 'Acciones', width: 200,
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="info" size="small" style={{ marginRight: 16 }}>
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
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormControl>
                <TextField
                    label='Busqueda por nombre'
                    sx={{ width: 300, height: 30, marginBottom: 8, marginTop: 2, marginLeft: 0, marginRight: 0}}
                    InputProps={{
                        endAdornment: <Searchicon />
                    }}
                    onChange={handleSearch}
                    />
            </FormControl>
            <Box sx={{ display: 'flex', minHeight: 600 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <DataGrid
                        rows={filterData}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[7, 10, 20]}
                        disableSelectionOnClick
                        components={{ Toolbar: GridToolbar }}
                    />
                </Box>
            </Box>
        </Box>
    );
}