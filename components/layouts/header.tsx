"use client";

import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/authContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const getInitials = () => {
    if (user?.empleado) {
      const nombres = user.empleado.nombres?.split(" ")[0] || "";
      const apellidos = user.empleado.apellidos?.split(" ")[0] || "";
      return (nombres[0] || "") + (apellidos[0] || "");
    }
    if (user?.cliente) {
      return user.cliente.nombre_empresa?.substring(0, 2).toUpperCase() || "CT";
    }
    return "CT";
  };

  const getName = () => {
    if (user?.empleado) {
      return `${user.empleado.nombres?.split(" ")[0] || ""} ${user.empleado.apellidos?.split(" ")[0] || ""}`;
    }
    if (user?.cliente) {
      return user.cliente.nombre_empresa || "Usuario";
    }
    return "Usuario";
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-end shrink-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-2 hover:bg-slate-100 rounded-lg px-2 py-1.5 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-xs font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-slate-700">{getName()}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </PopoverContent>
      </Popover>
    </header>
  );
}
