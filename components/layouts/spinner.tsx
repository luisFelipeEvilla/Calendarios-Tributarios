import { Box, CircularProgress } from "@mui/material";

type PropsType = {size?: string}
export default function Spinner({...props} : PropsType) {
    return (
        <Box sx={{ display: 'flex', width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={props.size || '5rem'}/>
        </Box>
    );
}