import Drawer from "@mui/material/Drawer";
import HomeIcon from '@mui/icons-material/Home';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Avatar from "@mui/material/Avatar";
import Image from 'next/image';
import { useRouter } from "next/dist/client/router";

const elements = [
    { name: 'Home', path: '/', icon: <HomeIcon /> },
    { name: 'Clientes', path: '/clientes', icon: <PeopleIcon /> },
    { name: 'calendario Tributario', path: '/calendarioTributario', icon: <CalendarTodayIcon /> }
]

export default function Navigation() {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path)
    }

    const getElements = () => (
        <div>
            {
                elements.map((element, index) => (
                    <ListItem key={index} disablePadding>
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

    const avatarStyle = {width: 120, height: 120};
    const drawerStyle = {width: 238, height: '100vh'};
    const drawerPaperStyle = {backgroundColor: 'primary.main', color: 'white'};
    const iconsStyle = {color: 'white'};

    return (
        <Drawer PaperProps={{sx: drawerPaperStyle}} variant="permanent" sx={drawerStyle}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5, marginBottom: 5}}>
                <Avatar sx={avatarStyle}>
                    <Image src='/images/avatar.png' alt='avatar' width={120} height={120}></Image>
                </Avatar>
                <Typography sx={{marginTop: 3}}>Roberto Robles</Typography>
            </Box>
            {getElements()}
        </Drawer>
    )
}