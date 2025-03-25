import React, { ReactElement, useContext, useState } from 'react';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchBar from './searchbar';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { periods, tiposPersona } from '../../config';
import { Departamento, Municipio } from '../../types';
import axios from 'axios';
import MessageModal from '../messageModal';
import { FiltersContext } from '../../contexts/FiltersContext';

type Tax = { id: number };
type PropsType = { data: Tax[], isDepartamental?: boolean, isMunicipal?: boolean, departamentos: Departamento[], municipios: Municipio[] }

export default function Table({ ...props }: PropsType): ReactElement {
    const [data, setData] = useState<Tax[]>(props.data)
    const [filterData, setFilterData] = useState(props.data);
    const [pageSize, setPageSize] = useState(10);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [error, setError] = useState(false);

    const { year, setYear } = useContext(FiltersContext);

    const router = useRouter();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredData = data.filter((value: any) => {
            return value.nombre.toLowerCase().includes(searchQuery);
        });

        setFilterData(filteredData);
    };

    const handleDelete = async (id: number) => {
        const url = `api/tax/${id}`;

        try {
            const response = await axios.delete(url);

            setModalOpen(true);
            setModalTitle('Impuesto eliminado con éxito');
            setError(false);

            // delete entry from data array
            const newData = data.filter((tax) => tax.id != id);
            setData(newData);
            const newFilterData = filterData.filter((tax) => tax.id != id);
            setFilterData(newFilterData);
        } catch (error) {
            setModalOpen(true);
            setModalTitle('Error al eliminar el impuesto');
            setError(true);
            alert(error);
            console.error(error)
        }
    };


    const columns: GridColDef[] = [
        { field: 'nombre', headerName: 'Nombre', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'persona', headerName: 'Aplica a', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => tiposPersona.find((type) => type.value == params.row.persona)?.name
        },
        {
            field: 'frecuencia', headerName: 'Frecuencia', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => periods.find((type) => type.value == params.row.frecuencia)?.name
        },
        {
            field: 'numero_cuotas', headerName: 'Número de cuotas', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.cuotas.length}`,
        },
        {
            field: 'acciones', headerName: 'Acciones', flex: 1, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="info" size="small" style={{ marginRight: 16 }}>
                        <Link href={`/calendarioTributario/${params.row.id}`} style={{ textDecoration: 'none', color: 'white' }}>Editar</Link>
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={e => handleDelete(params.row.id)}>
                        Eliminar
                    </Button>
                </Box>
            ),
        }
    ];

    const departamentalColumns: GridColDef[] = [
        { field: 'nombre', headerName: 'Nombre', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'departamento', headerName: 'Departamento', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => props.departamentos.find((departamento) => departamento.codigo_departamento == params.row.departamento)?.departamento
        },
        {
            field: 'persona', headerName: 'Aplica a', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => tiposPersona.find((type) => type.value == params.row.persona)?.name
        },
        {
            field: 'frecuencia', headerName: 'Frecuencia', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => periods.find((type) => type.value == params.row.frecuencia)?.name
        },
        {
            field: 'numero_cuotas', headerName: 'Número de cuotas', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.cuotas.length}`,
        },
        {
            field: 'acciones', headerName: 'Acciones', flex: 1, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="info" size="small" style={{ marginRight: 16 }}>
                        <Link href={`/calendarioTributario/${params.row.id}`} style={{ textDecoration: 'none', color: 'white' }}>Editar</Link>
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={e => handleDelete(params.row.id)}>
                        Eliminar
                    </Button>
                </Box>
            ),
        }
    ];

    const municipalColumns: GridColDef[] = [
        { field: 'nombre', headerName: 'Nombre', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'departamento', headerName: 'Departamento', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => props.departamentos.find((departamento) => departamento.codigo_departamento == params.row.departamento)?.departamento
        },
        {
            field: 'municipio', headerName: 'Municipio', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => props.municipios.find((municipio) => municipio.codigo_municipio == params.row.municipio)?.municipio
        },
        {
            field: 'persona', headerName: 'Aplica a', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => tiposPersona.find((type) => type.value == params.row.persona)?.name
        },
        {
            field: 'frecuencia', headerName: 'Frecuencia', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) => periods.find((type) => type.value == params.row.frecuencia)?.name
        },
        {
            field: 'numero_cuotas', headerName: 'Número de cuotas', flex: 1, headerAlign: 'center', align: 'center',
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.cuotas.length}`,
        },
        {
            field: 'acciones', headerName: 'Acciones', flex: 1, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <Box>
                    <Button variant="contained" color="info" size="small" style={{ marginRight: 16 }}>
                        <Link href={`/calendarioTributario/${params.row.id}`} style={{ textDecoration: 'none', color: 'white' }}>Editar</Link>
                    </Button>
                    <Button variant="contained" color="error" size="small" onClick={e => handleDelete(params.row.id)}>
                        Eliminar
                    </Button>
                </Box>
            ),
        }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <MessageModal modalOpen={modalOpen} setModalOpen={setModalOpen} error={error} title={modalTitle} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 8, alignContent: 'center', alignItems: 'center' }}>
                    <SearchBar handleSearch={handleSearch} />

                    <FormControl>
                        <InputLabel
                            id='vigencia'
                        >Vigencia</InputLabel>
                        <Select
                            label='vigencia'
                            name='vigencia'
                            value={year} onChange={(e) => setYear(e.target.value as number)}>
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

                </Box>

                <Button variant='contained' color='success' size='small' sx={{ width: 100, height: 40, marginRight: 10, marginTop: 3 }}
                    onClick={() => router.push('/calendarioTributario/create')}
                >
                    Agregar
                </Button>
            </Box>
            <Box sx={{ display: 'flex', minHeight: 600 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <DataGrid
                        rows={filterData}
                        columns={props.isDepartamental ? departamentalColumns : props.isMunicipal ? municipalColumns : columns}
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