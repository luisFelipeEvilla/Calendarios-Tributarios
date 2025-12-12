"use client";

import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthContext } from "../../contexts/authContext";
import axios from "axios";

function Copyright() {
  return (
    <p className="text-center text-sm text-muted-foreground mt-8">
      Copyright © R&R {new Date().getFullYear()}.
    </p>
  );
}

export default function SignInSide() {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { login } = useContext(AuthContext);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const credentials = new FormData(event.currentTarget);
    const username = credentials.get("user");
    const password = credentials.get("password");

    const url = "api/auth/login";

    try {
      const body = { username, password };

      const request = await axios.post(url, body);

      const response = request.data;
      if (response.statusCode !== 200) {
        setError(true);
        setErrorMessage("Usuario o contraseña incorrectos");
        return;
      }

      login(response.data.user, response.data.token);

      const rol = response.data.user.rol.nombre;

      if (rol === "admin") router.push("/calendarioTributario");
      if (rol === "auditor") router.push("/cliente");
      if (rol === "cliente")
        router.push(
          `/cliente/${response.data.user.cliente.id}/gestionTributaria`
        );
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnChange = () => {
    setError(false);
    setErrorMessage("");
  };

  return (
    <>
      <Head>
        <title>SGC</title>
      </Head>
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Banner Image */}
        <div className="hidden lg:block relative">
          <Image
            src="/images/login-banner.jpg"
            alt="Login banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Lock className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                Iniciar Sesión
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user">Nombre de usuario</Label>
                <Input
                  id="user"
                  name="user"
                  type="text"
                  required
                  autoFocus
                  onChange={handleOnChange}
                  className={error ? "border-destructive" : ""}
                />
                {error && errorMessage && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={handleOnChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Recordarme
                </Label>
              </div>

              <Button type="submit" className="w-full">
                Ingresar
              </Button>

              <Copyright />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
