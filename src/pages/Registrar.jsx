import { useState } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const Registrar = () => {
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repetirPassword, setRepetirPassword] = useState('')
    const [alerta, setAlerta] = useState({})
    const handleSubmit = async (e) => {
        e.preventDefault()
        if([nombre, email, password, repetirPassword].includes('')) {
            setAlerta({
                error: true,
                msg: 'Todos los campos son obligatorios'
            })
            return
        }
        if(password !== repetirPassword) {
            setAlerta({
                error: true,
                msg: 'Los Passwords No son Iguales'
            })
            return
        }
        if(password.length < 6) {
            setAlerta({
                error: true,
                msg: 'El Password es muy Corto, agrega mínimo 6 caracteres'
            })
            return
        }
        setAlerta({})
        try {
            const { data } = await clienteAxios.post(`/usuarios`, {
                nombre,
                email,
                password
            })
            setAlerta({
                msg: data.msg,
                error: false
            })
            setNombre('')
            setEmail('')
            setPassword('')
            setRepetirPassword('')
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta
  return (
    <>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Crea tu Cuenta y Administra tus <span className="text-slate-700">Proyectos</span></h1>

        {
            msg && <Alerta alerta={alerta} />
        }

        <form
            className="my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}
        >
            <div className="my-5">
                <label htmlFor="nombre" className="uppercase text-gray-600 block text-xl font-bold">Nombre</label>
                <input
                    type="text"
                    id="nombre"
                    placeholder="Tu Nombre"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                />
            </div>
            <div className="my-5">
                <label htmlFor="email" className="uppercase text-gray-600 block text-xl font-bold">Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Email de Registro"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div className="my-5">
                <label htmlFor="password" className="uppercase text-gray-600 block text-xl font-bold">Password</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password de Registro"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div className="my-5">
                <label htmlFor="password2" className="uppercase text-gray-600 block text-xl font-bold">Repite tu Password</label>
                <input
                    type="password"
                    id="password2"
                    placeholder="Repite tu Password"
                    className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
                    value={repetirPassword}
                    onChange={e => setRepetirPassword(e.target.value)}
                />
            </div>

            <input
                type="submit"
                value={'Crear Cuenta'}
                className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors "
            />
        </form>

        <nav className="lg:flex lg:justify-between">
            <Link
                to={'/'}
                className="block text-center my-5 text-slate-500 uppercase text-sm"
            >Ya tienes una cuenta?, Inicia Sesión</Link>
            <Link
                to={'/olvide-password'}
                className="block text-center my-5 text-slate-500 uppercase text-sm"
            >Olvide mi Password</Link>
        </nav>
    </>
  )
}

export default Registrar