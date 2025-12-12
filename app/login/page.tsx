"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, User, KeyRound, ArrowRight, Eye, EyeOff } from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/authContext";

const ROLE_ROUTES: Record<string, string> = {
  admin: "/calendarioTributario",
  auditor: "/cliente",
};

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("user");
    const password = formData.get("password");

    try {
      const { data: response } = await axios.post("/api/auth/login", {
        username,
        password,
      });

      if (response.status !== 200) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      const { user, token } = response.data;
      login(user, token);

      const roleName = user.rol.nombre;
      const redirectPath =
        ROLE_ROUTES[roleName] ||
        `/cliente/${user.cliente?.id}/gestionTributaria`;

      router.push(redirectPath);
    } catch {
      setError("Error al iniciar sesión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError("");

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Imagen con overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="/images/login-banner.jpg"
          alt="Login banner"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/40 via-blue-700/30 to-indigo-900/40" />

        {/* Contenido sobre la imagen */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div></div>

          <div className="space-y-6">
            <blockquote className="text-2xl font-light leading-relaxed">
              "Simplificamos tu gestión tributaria para que puedas enfocarte en
              lo que realmente importa."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-blue-300" />
              <span className="text-blue-200 text-sm">
                Gestión tributaria inteligente
              </span>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gradient-to-br from-slate-100 via-white to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          {/* Logo móvil */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              R&R
            </h2>
            <p className="text-slate-500 text-sm">
              Sistema de Gestión Contable
            </p>
          </div>

          {/* Card del formulario */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-slate-300/50 p-8 sm:p-10 border border-white/50 ring-1 ring-slate-200/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-xl shadow-blue-500/40 mb-5 ring-4 ring-white">
                <Lock className="w-9 h-9 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Bienvenido de nuevo
              </h1>
              <p className="text-slate-500 mt-2">
                Ingresa tus credenciales para continuar
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="user"
                  className="text-slate-700 font-medium text-sm"
                >
                  Usuario
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="user"
                    name="user"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    required
                    autoFocus
                    disabled={isLoading}
                    onChange={clearError}
                    className={`pl-12 h-13 rounded-2xl border-slate-200 bg-slate-50/80 focus:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                        : "focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-medium text-sm"
                >
                  Contraseña
                </Label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                    onChange={clearError}
                    className="pl-12 pr-12 h-13 rounded-2xl border-slate-200 bg-slate-50/80 focus:bg-white focus:border-blue-500 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50/80 text-red-600 text-sm px-4 py-3 rounded-2xl border border-red-200/50 flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="remember"
                    disabled={isLoading}
                    className="cursor-pointer rounded-md border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-slate-600 font-normal cursor-pointer select-none"
                  >
                    Recordarme
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer w-full h-13 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold shadow-xl shadow-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Ingresando...
                  </>
                ) : (
                  <>
                    Ingresar
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 mt-8 font-medium">
            © {new Date().getFullYear()} R&R · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}
