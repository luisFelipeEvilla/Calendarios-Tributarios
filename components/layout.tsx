import { Breadcrumbs, Link } from "@mui/material";
import Box from '@mui/material/Box';
import Navigation from "./layouts/navigation";

export default function Layout({ ...props }) {

    return (
        <Box sx={{ display: 'flex', height: '100vh'}}>
            <Navigation/>
            <Box>
                <Breadcrumbs aria-label="breadcrumb" sx={{ backgroundColor: 'primary.main', height: 45, color: 'white', paddingLeft: 2, display: 'flex', alignItems: 'center' }}>
                    <Link underline="hover" color="inherit" href="/">
                        Home
                    </Link>
                    <Link color="inherit" underline="hover" href="/">
                        Calendario Tributario
                    </Link>
                </Breadcrumbs >
                {props.children}
            </Box>
        </Box >
    )
}	