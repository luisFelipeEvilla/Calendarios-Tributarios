import { Breadcrumbs, Link } from "@mui/material";
import Box from '@mui/material/Box';
import Navigation from "./layouts/navigation";

export default function Layout({ ...props }) {

    return (
        <Box sx={{ display: 'flex', height: '100vh', flexGrow: 1,}}>
            <Navigation/>
            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
                {props.children}
            </Box>
        </Box >
    )
}	