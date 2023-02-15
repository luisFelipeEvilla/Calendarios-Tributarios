import { Box } from "@mui/system";

export default function Layout ({ ...props }) {
    return (
        <Box sx={{display:"flex"}}>
            <Box sx={{width: 400, height: '100vh', backgroundColor: 'gray'}}>

            </Box>
            {props.children}
        </Box>
    )
}	