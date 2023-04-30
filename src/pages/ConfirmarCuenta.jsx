import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"
const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({})
  const [confirmada, setConfirmada] = useState(false)
  const params = useParams()
  const { id } = params
  useEffect(() => {
    const confirmar = async () => {
      try {
        const { data } = await clienteAxios(`/usuarios/confirmar/${id}`)
        setAlerta({
            msg: data.msg,
            error: false
        })
        setConfirmada(true)
    } catch (error) {
        setAlerta({
            msg: error.response.data.msg,
            error: true
        })
    }
    }
    confirmar()
  }, [])
  const { msg } = alerta
  return (
    <div>
        <h1 className="text-sky-600 font-black text-6xl capitalize">Confirma tu Cuenta y Empieza a Crear tus <span className="text-slate-700">Proyectos</span></h1>

        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">\
          {
              msg && <Alerta alerta={alerta} />
          }
          {
            confirmada && 
            <Link
              to={'/'}
              className="block text-center my-5 text-slate-500 uppercase text-sm"
            >Ya tienes una cuenta?, Inicia Sesión</Link>
          }
        </div>
    </div>
  )
}

export default ConfirmarCuenta