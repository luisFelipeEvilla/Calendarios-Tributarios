import { Breadcrumbs, Link } from "@mui/material";
import Box from '@mui/material/Box';
import Navigation from "./layouts/navigation";

export default function Layout({ ...props }) {

    return (
        <Box sx={{display: 'flex'}}>
            <Box sx={{height: '100vh', minWidth: 220, backgroundColor: "primary.main"}}> 
                <Navigation>
                </Navigation>
            </Box>

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