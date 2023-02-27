import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import { useRouter } from "next/dist/client/router";
import Image from 'next/image';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/authContext';

const elements = [
    // { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
    { name: 'calendario Tributario', path: '/calendarioTributario', icon: <CalendarTodayIcon /> }
]

export default function Navigation({...props}) {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path)
    }

    const getElements = () => (
        <div>
            {
                elements.map((element, index) => (
                    <ListItem key={index} disablePadding sx={itemStyle}>
                        <ListItemButton onClick={e => handleNavigation(element.path)}>
                            <ListItemIcon sx={iconsStyle}>
                                {element.icon}
                            </ListItemIcon>
                            <ListItemText primary={element.name} sx={iconsStyle} />
                        </ListItemButton>
                    </ListItem>
                ))
            }
        </div>
    )

    const avatarStyle = {width: 120, height: 120, boxShadow: '4px 6px 26px -7px rgba(0,0,0,0.5);'};
    const drawerStyle = {width: 238, height: '100vh'};
    const drawerPaperStyle = {backgroundColor: 'primary.main', color: 'secondary.main'};
    const iconsStyle = {color: 'secondary.main'};
    const itemStyle = {'&:hover': {transform: 'scale(1.03)', backgroundColor: 'rgba(255,255,255,0.1)'}};

    return (
        <Drawer PaperProps={{sx: drawerPaperStyle}} variant="permanent" sx={drawerStyle}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5, marginBottom: 5}}>
                <Avatar sx={avatarStyle}>
                    <Image src='/images/avatar.png' alt='avatar' width={120} height={120}></Image>
                </Avatar>
                <Typography sx={{marginTop: 3}}>{user.nombres} {user.apellidos}</Typography>
            </Box>
            {getElements()}
        </Drawer>
    )
}