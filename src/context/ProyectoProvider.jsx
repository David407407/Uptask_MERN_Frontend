import { useState, useEffect, createContext } from "react";
import io from "socket.io-client";
import { useNavigate } from 'react-router-dom'
import useAuth from "../hooks/useAuth";
import clienteAxios from "../config/clienteAxios";
let socket
const ProyectoContext = createContext()
const ProyectoProvider = ({children}) => {
    const [proyectos, setProyectos] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [tarea, setTarea ] = useState({})
    const [alerta, setAlerta] = useState({})
    const [cargando, setCargando] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [colaborador, setColaborador] = useState({})
    const [buscador, setBuscador] = useState(false)

    const { auth } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return
    
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)
            } catch (error) {
                console.log(error)
            }
            
        }
        obtenerProyectos()
    }, [auth])
    const obtenerProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return
            setCargando(true)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally {
            setCargando(false)
        }
    }
    const mostrarAlerta = alerta => {
        setAlerta(alerta)
        setTimeout(() => {
            setAlerta({})
        }, 5000);
    }
    
    const submitProyecto = async proyecto => {
        if(proyecto.id) {
            await editarProyecto(proyecto)
        } else {
            await crearProyecto(proyecto)
        }
        
    }
    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)
            setAlerta({
                msg: 'Proyecto Actualizado Correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            
        }
    }
    const crearProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos`, proyecto, config)
            setProyectos([...proyectos, data])
            setAlerta({
                msg: 'Proyecto Creado Correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000);
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(true)
    }

    const submitTarea = async tarea => {
        if(tarea.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }
        
    }

    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)
            setAlerta({})
            setModalFormularioTarea(false)

            // Socket IO
            socket.emit('actualizar tarea', data)
        } catch (error) {
            console.log(error)
        }
    }
    
    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config)
            setAlerta({})
            setModalFormularioTarea(false)

            // Socket IO
            socket.emit('nueva tarea', data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            
            setModalEliminarTarea(false)
            // Socket IO
            socket.emit('eliminar tarea', tarea)
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setColaborador(data)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleEliminarColaborador = colaborador => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id}, config)
            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id)
            setProyecto(proyectoActualizado)
            setAlerta({
                msg: data.msg,
                error: false
            }),
            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            console.log(error.response)
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            setTarea({})
            setAlerta({})

            socket.emit('cambiar estado', data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    // Funciones de Socket IO
    const submitTareasProyecto = tareaNueva => {
        // Agrega la tarea al state
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tareaNueva]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tareaEliminada => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter( tareaState => tareaState._id !== tareaEliminada._id)
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tareaActualizada => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyecto.tareas.map( tareaState => tareaState._id === tareaActualizada._id ? tareaActualizada : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = nuevoEstadoTarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === nuevoEstadoTarea._id ? nuevoEstadoTarea : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }
    return (
        <ProyectoContext.Provider value={{proyectos, alerta, mostrarAlerta, submitProyecto, obtenerProyecto, proyecto, cargando, eliminarProyecto, handleModalTarea, modalFormularioTarea, submitTarea, handleModalEditarTarea, tarea, modalEliminarTarea, handleModalEliminarTarea, eliminarTarea, submitColaborador, colaborador, agregarColaborador, handleEliminarColaborador, modalEliminarColaborador, eliminarColaborador, completarTarea, buscador, handleBuscador, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea, cerrarSesionProyectos }}>
            {children}
        </ProyectoContext.Provider>
    )
}

export {
    ProyectoProvider
}
export default ProyectoContext