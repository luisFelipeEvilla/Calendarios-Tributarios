import { parseCookies, setCookie } from "nookies";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<any | null>(null);

export function AuthProvider({ children }: any) {
    const [user, setUser] = useState<any>({});
    const [token, setToken] = useState<string | null>('');

    useEffect(() => {
        // Comprueba si el usuario ya ha iniciado sesión
        const cookies = parseCookies();

        const userData = JSON.parse(cookies.user);
        const token = cookies.token;

        console.log(userData);
        
        if (userData && token) {
            setUser(userData);
            setToken(token);
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

    return (
        <AuthContext.Provider value={{ user, login }}>
            {children}
        </AuthContext.Provider>
    );
}