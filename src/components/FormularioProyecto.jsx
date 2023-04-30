import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import Alerta from "./Alerta"

const FormularioProyecto = () => {
    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [cliente, setCliente] = useState('')
    const [fechaEntrega, setFechaEntrega] = useState('')
    const { alerta, mostrarAlerta, submitProyecto, proyecto } = useProyectos()
    const params = useParams()
    useEffect(() => {
        if(params.id) {
            setId(proyecto?._id)
            setNombre(proyecto?.nombre)
            setDescripcion(proyecto?.descripcion)
            setFechaEntrega(proyecto?.fechaEntrega?.split('T')[0])
            setCliente(proyecto?.cliente)
        }
    }, [])
    const handleSubmit = async e => {
        e.preventDefault()
        if([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: 'Todos los Campos Son obligatorios',
                error: true
            })
            return
        }
        await submitProyecto({
            id,
            nombre,
            descripcion,
            fechaEntrega,
            cliente
        })

        setId(null)
        setNombre('')
        setDescripcion('')
        setFechaEntrega('')
        setCliente('')
    }
    const { msg } = alerta
  return (
    <form 
        className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow'
        onSubmit={handleSubmit}
    >
        {msg && <Alerta alerta={alerta}/> }
        <div className="mt-5">
            <label htmlFor="nombre" className='text-gray-700 uppercase font-bold text-sm'>Nombre del Proyecto</label>
            <input 
                type="text"
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                id='nombre'
                placeholder='Nombre del Proyecto' 
                value={nombre}
                onChange={e => setNombre(e.target.value)}
            />
        </div>
        <div className="mt-5">
            <label htmlFor="descripcion" className='text-gray-700 uppercase font-bold text-sm'>Descripcion del Proyecto</label>
            <textarea 
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                id='nombre'
                placeholder='Descripcion del Proyecto' 
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
            />
        </div>
        <div className="mt-5">
            <label htmlFor="fechaEntrega" className='text-gray-700 uppercase font-bold text-sm'>Fecha de Entrega del Proyecto</label>
            <input 
                type="date"
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                id='fechaEntrega'
                value={fechaEntrega}
                onChange={e => setFechaEntrega(e.target.value)}
            />
        </div>
        <div className="mt-5">
            <label htmlFor="cliente" className='text-gray-700 uppercase font-bold text-sm'>Nombre del Cliente</label>
            <input 
                type="text"
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                id='cliente'
                placeholder='Nombre del Cliente' 
                value={cliente}
                onChange={e => setCliente(e.target.value)}
            />
        </div>

        <input 
            type="submit" 
            value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'}
            className="w-full bg-sky-600 p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors text-center mt-5"        
        />
    </form>
  )
}

export default FormularioProyecto