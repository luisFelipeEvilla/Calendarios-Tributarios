import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { DesktopDatePicker, DatePicker, esES, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";


export default function FeedForm({ ...props }) {
    const [modal, setModal] = useState(false);
    const [nit, setNit] = useState<number>();
    const [date, setDate] = useState<Dayjs | null>(
        dayjs(new Date()),
    );
    
    const handleDateChange = (newDate: Dayjs | null) => {
        setDate(newDate);
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        props.handleAddFeed(props.index, { nit, date: date })
        setModal(false);
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Box marginTop={2} marginBottom={3}>
            <Button onClick={e => setModal(true)} variant="contained" color="success">Agregar</Button>
            <Modal
                open={modal}
                onClose={e => setModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant="h4" component="h1" marginBottom={8} textAlign='center'>
                        Agregar Fecha de presentación
                    </Typography>

                    <Box component='form' onSubmit={e => handleSubmit(e)}>
                        <FormControl fullWidth>
                            <TextField
                                id="nit"
                                label="Digito/s de asignación"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onChange={(e) => setNit(parseInt(e.target.value))}
                                required
                                autoFocus
                            />
                        </FormControl>
                        <FormControl sx={{ marginTop: 3 }} fullWidth>
                            <LocalizationProvider localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}  dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Fecha de presentación"
                                    inputFormat="MM/DD/YYYY"
                                    value={date}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </FormControl>
                        <Box display='flex' justifyContent='flex-end' marginTop={3}>
                            <Button sx={{ marginRight: 2 }} onClick={e => setModal(false)} variant="contained" color="error">Cancelar</Button>
                            <Button type="submit" variant="contained" color="success">Guardar</Button>
                        </Box>
                    </Box>
                </Box>
            </Modal >
        </Box >
    )
}