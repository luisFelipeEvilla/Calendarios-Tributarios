"use client";

import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/contexts/authContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, Landmark, LogOut, Sparkles } from "lucide-react";

interface NavElement {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export default function Navigation() {
  const { user, logout } = useContext(AuthContext);
  const [elements, setElements] = useState<NavElement[]>([]);
  const [nombre, setNombre] = useState<string>("");
  const [rol, setRol] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    if (user.rol == null) return;

    const navegacionEmpleados: NavElement[] = [
      { name: "Clientes", path: "/cliente", icon: <Users /> },
    ];

    const navegacionAdministrador: NavElement[] = [
      { name: "Clientes", path: "/cliente", icon: <Users /> },
      {
        name: "Configuración",
        path: "/calendarioTributario",
        icon: <Calendar />,
      },
    ];

    if (user.rol.nombre === "cliente") {
      const navegacionClientes: NavElement[] = [
        {
          name: "Mis impuestos",
          path: `/cliente/${user.cliente.id}/gestionTributaria`,
          icon: <Landmark />,
        },
      ];
      setElements(navegacionClientes);
      setNombre(user.cliente.nombre_empresa);
      setRol("Cliente");
    } else {
      setNombre(
        user.empleado.nombres.split(" ")[0] +
          " " +
          user.empleado.apellidos.split(" ")[0]
      );
    }

    if (user.rol.nombre === "admin") {
      setElements(navegacionAdministrador);
      setRol("Administrador");
    }
    if (user.rol.nombre === "auditor") {
      setElements(navegacionEmpleados);
      setRol("Auditor");
    }
  }, [user]);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + "/");

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Header */}
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-9 w-9 shrink-0 ring-2 ring-sidebar-primary/30 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
            <AvatarImage src="/images/logo.png" alt="Logo" />
            <AvatarFallback className="bg-linear-to-br from-sidebar-primary to-sidebar-primary/70 text-white font-bold text-xs">
              CT
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-tight truncate text-sidebar-foreground">
              {nombre}
            </span>
            <span className="text-[11px] font-medium text-sidebar-foreground/60">
              {rol}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="opacity-30 group-data-[collapsible=icon]:mx-2" />

      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold px-2">
            Navegación
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {elements.map((element) => {
                const active = isActive(element.path);
                return (
                  <SidebarMenuItem key={element.path}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(element.path)}
                      isActive={active}
                      tooltip={element.name}
                      className={
                        active
                          ? "bg-linear-to-r from-sidebar-primary to-sidebar-primary/80 text-white shadow-lg shadow-sidebar-primary/25 font-medium"
                          : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }
                    >
                      {element.icon}
                      <span>{element.name}</span>
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 group-data-[collapsible=icon]:p-1">
        <SidebarSeparator className="mb-2 opacity-30 group-data-[collapsible=icon]:mx-1" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Cerrar Sesión"
              className="text-sidebar-foreground/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
