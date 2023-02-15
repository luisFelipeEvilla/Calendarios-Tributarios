import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function Layout({ ...props }) {
    return (
        <Box sx={{ display: "flex" }}>
            <Box sx={{ width: 400, height: '100vh', backgroundColor: '#293437' }}>
            </Box>
            <Box>
                <Breadcrumbs aria-label="breadcrumb" sx={{backgroundColor: '#293437', height: 45, color: 'white', paddingLeft: 2, display: 'flex', alignItems: 'center'}}>
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