import Drawer from "@mui/material/Drawer";
import HomeIcon from '@mui/icons-material/Home';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Avatar from "@mui/material/Avatar";
import Image from 'next/image';

const elements = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
    { name: 'calendario Tributario', path: '/calendarioTributario', icon: <CalendarTodayIcon /> }
]

export default function Navigation() {
    const getElements = () => (
        <div>
            {
                elements.map((element, index) => (
                    <ListItem key={index} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {element.icon}
                            </ListItemIcon>
                            <ListItemText primary={element.name} color='white' />
                        </ListItemButton>
                    </ListItem>
                ))
            }
        </div>
    )
    return (
        <Drawer variant="permanent" sx={{ width: 238, height: '100vh' }}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5, marginBottom: 5}}>
                <Avatar sx={{width: 120, height: 120}}>
                    <Image src='/images/avatar.png' alt='avatar' width={120} height={120}></Image>
                </Avatar>
                <Typography sx={{marginTop: 3}}>Roberto Robles</Typography>
            </Box>
            {getElements()}
        </Drawer>
    )
}