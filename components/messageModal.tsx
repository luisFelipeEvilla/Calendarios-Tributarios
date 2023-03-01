import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

type PropsType = { modalOpen: boolean, setModalOpen: (value: boolean) => void, title: string, message: string }

export default function MessageModal({ ...props }) {
    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '1px solid #000',
        boxShadow: 24,
        display: 'flex',  
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',

        p: 4,
    };

    return (
        <Box>
            <Modal
                open={props.modalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={e => { props.setModalOpen(false) }}
            >
                <Box sx={style}>
                        {
                            !props.error ? 
                            <CheckCircleIcon color='success' sx={{ width: 80, height: 80 }} /> :
                            <ErrorIcon color='error' sx={{ width: 80, height: 80 }} />
                        }
                    <Typography variant="h5" component="h1" marginBottom={8} textAlign='center'>
                        {props.title}
                    </Typography>
                    <Button sx={{width: 100}} size='medium' variant='contained' color='success' onClick={e => props.setModalOpen(false)}>Aceptar</Button>
                </Box>
            </Modal>
        </Box>
    )
}