import Router from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/authContext";

export default function PrivateRoute({children}: any) {
    const { user} = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            Router.push('/login');
        }
    }, [user])

    return (
        <>{children}</>
    )
}