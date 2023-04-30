import { useState } from "react"
import { Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios";
import Alerta from "../components/Alerta";

const OlvidePassword = () => {
    const [email, setEmail] = useState('')
    const [alerta, setAlerta] = useState({})
    const validarEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    const handleSubmit = async e => {
        e.preventDefault()
        if(email === '' || !validarEmail.test(email)) {
            setAlerta({
                msg: 'El Email es Obligatorio',
                error: true
            })
            return
        }

        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, {
                email
            })
            setAlerta({
                msg: data.msg,
                error: false
            })
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
        <h1 className="text-sky-600 font-black text-6xl capitalize">Recupera tu Acceso y No Pierdas tus <span className="text-slate-700">Proyectos</span></h1>

        {
            msg && <Alerta alerta={alerta} />
        }

        <form 
            className="my-10 bg-white shadow rounded-lg p-10"
            onSubmit={handleSubmit}    
        >
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

            <input
                type="submit"
                value={'Enviar Instrucciones'}
                className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors "
            />
        </form>

        <nav className="lg:flex lg:justify-between">
            <Link
                to={'/'}
                className="block text-center my-5 text-slate-500 uppercase text-sm"
            >Ya tienes una cuenta?, Inicia Sesión</Link>
            <Link
                to={'/registrar'}
                className="block text-center my-5 text-slate-500 uppercase text-sm"
            >No tienes una cuenta?, Registrate</Link>
        </nav>
    </>
  )
}

export default OlvidePassword