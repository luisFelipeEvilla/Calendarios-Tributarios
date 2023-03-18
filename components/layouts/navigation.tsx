import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Drawer from "@mui/material/Drawer";
import { useRouter } from "next/dist/client/router";
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/authContext';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';


export default function Navigation({ ...props }) {
    const { user, logout } = useContext(AuthContext);
    const [ elements, setElements ] = useState<any[]>([]);
    const [nombre, setNombre] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        if (user.rol == null) return;

        const navegacionEmpleados = [
            // { name: 'Home', path: '/', icon: <HomeIcon /> },
            { name: 'Clientes', path: '/cliente', icon: <PeopleIcon /> },
        ]
    
        const navegacionAdministrador = [
            { name: 'Clientes', path: '/cliente', icon: <PeopleIcon /> },
            { name: 'Configuración', path: '/calendarioTributario', icon: <CalendarTodayIcon /> },
        ]
    
        const navegacionClientes = [
            { name: 'Mis Impuestos', path: `/cliente/${user.cliente.id}/gestionTributaria`, icon : <CalendarTodayIcon />}
        ]

        if (user.rol.nombre == 'cliente') {
            setElements(navegacionClientes)
            setNombre(user.cliente.nombre_empresa);
        } else setNombre(user.empleado.nombres + ' ' + user.empleado.apellidos)

        if (user.rol.nombre == 'admin') setElements(navegacionAdministrador);
        if (user.rol.nombre == 'auditor') setElements(navegacionEmpleados) 
        
    }, [user]);

    const handleNavigation = (path: string) => {
        window.location.href = path;
    }

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    }

    const avatarStyle = { width: 120, height: 120, boxShadow: '4px 6px 26px -7px rgba(0,0,0,0.5);' };
    const drawerStyle = { width: 238, height: '100vh', backgroundColor: 'primary.main', color: 'secondary.main' };
    const drawerPaperStyle = { width: 238, backgroundColor: 'primary.main', color: 'secondary.main' };
    const iconsStyle = { color: 'secondary.main' };
    const itemStyle = { '&:hover': { transform: 'scale(1.03)', backgroundColor: 'rgba(255,255,255,0.1)' } };

    return (
        <Drawer PaperProps={{ sx: drawerPaperStyle }} variant="permanent" sx={drawerStyle}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                <Avatar sx={avatarStyle}>
                    <Image src='/images/logo.png' alt='avatar' width={120} height={120}></Image>
                </Avatar>
                <Typography sx={{ marginTop: 3 }}>
                    {nombre}
                </Typography>
            </Box>
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
            <ListItem disablePadding sx={itemStyle}>
                <ListItemButton onClick={e => handleLogout()}>
                    <ListItemIcon sx={iconsStyle}>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary='Cerrar Sesión' sx={iconsStyle} />
                </ListItemButton>
            </ListItem>
        </Drawer>
    )
}