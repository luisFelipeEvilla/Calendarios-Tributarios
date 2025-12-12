"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, Landmark, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavElement {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const NAVEGACION_EMPLEADOS: NavElement[] = [
  { name: "Clientes", path: "/cliente", icon: <Users className="h-5 w-5" /> },
];

const NAVEGACION_ADMINISTRADOR: NavElement[] = [
  { name: "Clientes", path: "/cliente", icon: <Users className="h-5 w-5" /> },
  {
    name: "Configuración",
    path: "/calendarioTributario",
    icon: <Calendar className="h-5 w-5" />,
  },
];

export default function AppSidebar() {
  const { user, logout } = useAuth();
  const [elements, setElements] = useState<NavElement[]>([]);
  const [nombre, setNombre] = useState<string>("");
  const [rol, setRol] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    if (!user?.rol) return;

    const rolNombre = user.rol.nombre;

    if (rolNombre === "cliente" && user.cliente) {
      const navegacionClientes: NavElement[] = [
        {
          name: "Mis impuestos",
          path: `/cliente/${user.cliente.id}/gestionTributaria`,
          icon: <Landmark className="h-5 w-5" />,
        },
      ];
      setElements(navegacionClientes);
      setNombre(user.cliente.nombre_empresa);
      setRol("Cliente");
      return;
    }

    if (user.empleado) {
      const nombreEmpleado =
        user.empleado.nombres.split(" ")[0] +
        " " +
        user.empleado.apellidos.split(" ")[0];
      setNombre(nombreEmpleado);
    }

    if (rolNombre === "admin") {
      setElements(NAVEGACION_ADMINISTRADOR);
      setRol("Administrador");
    } else if (rolNombre === "auditor") {
      setElements(NAVEGACION_EMPLEADOS);
      setRol("Auditor");
    }
  }, [user]);

  const handleNavigation = (path: string) => {
    window.location.href = path;
  };

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + "/");

  return (
    <aside className="w-44 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex flex-col items-center gap-2 text-center">
          <Avatar className="h-12 w-12 ring-2 ring-blue-500/30">
            <AvatarImage src="/images/logo.png" alt="Logo" />
            <AvatarFallback className="bg-blue-600 text-white font-bold text-sm">
              CT
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">{nombre}</span>
            <span className="text-xs text-slate-400">{rol}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold px-3 mb-2">
          Navegación
        </p>
        <ul className="space-y-1">
          {elements.map((element) => {
            const active = isActive(element.path);
            return (
              <li key={element.path}>
                <button
                  onClick={() => handleNavigation(element.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  {element.icon}
                  <span>{element.name}</span>
                  {active && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-white" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
