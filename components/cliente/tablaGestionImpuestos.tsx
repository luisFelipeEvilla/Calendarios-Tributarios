import styled from "@emotion/styled";
import { Box, TextField } from "@mui/material"
import { DataGrid, GridColDef, GridRowModel, GridValidRowModel } from "@mui/x-data-grid"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { esES } from "@mui/material/locale";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";


export default function TablaGestionImpuestos({ ...props }) {
    const [mes, setMes] = useState(dayjs(new Date()));
    const [impuestosFiltrados, setImpuestosFiltrados] = useState(props.impuestos);
    const mensajeFechaNula = 'No Reportada';

    useEffect(() => {
        filtrarPorMes();
    }, [mes])

    const filtrarPorMes = () => {
        const fecha = mes.toDate();
        const filtrado = props.impuestos.filter((impuesto: any) => {
            return (impuesto.fecha_limite.getMonth() == fecha.getMonth() && impuesto.fecha_limite.getFullYear() == fecha.getFullYear());
        });

        setImpuestosFiltrados(filtrado);
    }

    const formatoFecha: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
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
            valueFormatter: (params) => params.value ? params.value.toLocaleDateString('es-co', formatoFecha) : mensajeFechaNula,
            editable: true
        },
        {
            field: 'fecha_pago', headerName: 'Fecha de Pago', flex: 1, headerAlign: 'center', align: 'center',
            type: 'date',
            valueFormatter: (params) => params.value ? params.value.toLocaleDateString('es-co', formatoFecha) : mensajeFechaNula,
            editable: true
        },
    ]

    const handleUpdate = async (newRow: GridValidRowModel) => {
        const idImpuesto = newRow.id;

        const impuesto = props.impuestos.find((impuesto: any) => impuesto.id == idImpuesto);

        if (impuesto) {
            if (newRow.field == 'fecha_presentacion') impuesto.fecha_presentacion = newRow.value;
            if (newRow.field == 'fecha_pago') impuesto.fecha_pago = newRow.value;
        }

        // todo actualizar impuesto
        const url = `/api/client/${props.idCliente}/gestionTributaria/${idImpuesto}`
        const response = await axios.put(url, impuesto);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 800, width: 1000 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={esES} >
                <DatePicker
                    views={['month', 'year']}
                    label="Mes"
                    value={mes}
                    onChange={(newDate) => setMes(newDate || dayjs(new Date()))}
                    renderInput={(params) => <TextField {...params}
                        style={{ width: 200, margin: 'auto', marginBottom: 25 }}
                        select={false}
                    />
                    }
                />

            </LocalizationProvider>

            <Box sx={{ flexGrow: 1 }}>
                <DataGrid
                    columns={columnas}
                    rows={impuestosFiltrados}
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
                    onCellEditCommit={handleUpdate}
                    getRowClassName={(params) => {
                        //@ts-ignore
                        if (params.row.fecha_limite < new Date() && params.row.fecha_presentacion == null) return 'vencido'

                        return '';
                    }}
                />
            </Box>
        </Box>
    )
}