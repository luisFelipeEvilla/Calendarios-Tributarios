import  Router from "next/router";
import { parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<any | null>(null);

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState<any>({});
    const [token, setToken] = useState<string | null>('');

    useEffect(() => {
        // Comprueba si el usuario ya ha iniciado sesión
        const cookies = parseCookies();

        try {
            const userData = JSON.parse(cookies.user);
            const token = cookies.token;

            if (userData && token) {
                setUser(userData);
                setToken(token);
            }
        } catch (error) {
            console.error(error);
            Router.push('/login');
        }
    }, []);

    const login = (user: any, token: string) => {
        setUser(user);
        setToken(token);

        // save token in cookies
        setCookie(null, 'token', token, {
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
        });

        // save user in cookies
        setCookie(null, 'user', JSON.stringify(user), {
            maxAge: 30 * 24 * 60 * 60,
            path: '/',
        });
    }

    const logout = () => {
        setUser(null);
        setToken(null);

        // remove token from cookies
        setCookie(null, 'token', '', {
            maxAge: -1,
            path: '/'
        });

        // remove user from cookies
        setCookie(null, 'user', '', {
            maxAge: -1,
            path: '/',
        });
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}