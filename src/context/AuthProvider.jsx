import { useState, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
const AuthContext = createContext()
const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('token')
        const autenticarUsuario = async () => {
            if(!token) {
                setCargando(false)
                return
            }
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            try {
                const { data } = await clienteAxios('usuarios/perfil', config)
                setAuth(data)
            } catch (error) {
                setAuth({})
                console.log(error)
            } finally {
                setCargando(false)
            }
        }
        autenticarUsuario()
    }, [])

    const cerrarSesionAuth = () => {
        setAuth({})
    }
    return (
        <AuthContext.Provider value={{auth, setAuth, cargando, cerrarSesionAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}
export default AuthContext