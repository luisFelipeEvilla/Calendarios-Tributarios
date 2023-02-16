import React, { ReactElement } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Button, FormControl } from '@mui/material';
import TextField from '@mui/material/TextField';
import Searchicon from '@mui/icons-material/Search';

export default function Table({ ...props }): ReactElement {
    const [filterData, setFilterData] = React.useState(props.data);
    const [pageSize, setPageSize] = React.useState(10);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredData = props.data.filter((value: any) => {
            return value.nombre.toLowerCase().includes(searchQuery);
        });

        setFilterData(filteredData);
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', flex: 0.2, headerAlign: 'center', align: 'center' },
        { field: 'nombre', headerName: 'Nombre', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'frecuencia', headerName: 'Frecuencia',  flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'numero_cuotas', headerName: 'Número de cuotas',  flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.cuotas.length}`,
        },
        {
            field: 'acciones', headerName: 'Acciones',   flex: 1, headerAlign: 'center', align: 'center',
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
                        rowsPerPageOptions={[10, 25, 100]}
                        disableSelectionOnClick
                        components={{ Toolbar: GridToolbar }}
                        initialState={{
                            sorting: {
                                sortModel: [
                                    {
                                        field: 'nombre',
                                        sort: 'asc',
                                    },
                                ],
                            }
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}