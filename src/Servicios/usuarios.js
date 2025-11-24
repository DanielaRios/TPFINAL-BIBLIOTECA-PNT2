import axios from "axios"
import { normalizeClass } from "vue"

class ServicioUsuarios {
    #url = ''

    constructor() {
        this.#url = 'https://69164899a7a34288a27cee7e.mockapi.io/api/Usuario/'
    }

    getAll = async () => {
        try {
            const { data: usuarios } = await axios.get(this.#url)
            return usuarios
        }
        catch (error) {
            console.error('Error usuarios GET', error.message)
        }
    }

    getById = async (id) => {
        try {
            const { data } = await axios.get(this.#url + id)
            return data
        } catch (error) {
            console.error('Error getById', error.message)
            throw error
        }
    }


    autenticacion = async (user, pass) => {
        try { 
            const { data: usuarios } = await axios.get(this.#url)
            const userData = usuarios.find(
                u => u.userName === user.trim() && u.password === pass
             )

            return  userData ?? null
        }
        catch (error) {
            console.error('Error en autenticacion', error.message)
            throw new Error('Error en autenticación: ' + error.message)
        }
    }

    registrar = async (nuevoUsuario) => {
        try {
            const usuarios = await this.getAll()
            console.log(usuarios)

            const existeUsuario = usuarios.some(u => u.userName === nuevoUsuario.userName.trim())
            if (existeUsuario) {
                return { ok: false, msg: "El usuario ya existe." }
            }

            const existeEmail = usuarios.some(u => u.email === nuevoUsuario.email.trim())
            if (existeEmail) {
                return { ok: false, msg: "El email ya fue registrado." }
            }

            const existeDNI = usuarios.some(u => u.dni === nuevoUsuario.dni)
            if (existeDNI) {
                return { ok: false, msg: "El DNI ya tiene una cuenta." }
            }

            let datos = { ...nuevoUsuario }
            datos.esAdmin = false
            datos.librosAlquilados = []

            const { data } = await axios.post(this.#url, datos)

            return { ok: true, data }
        }
        catch (error) {
            console.error("Error en registrar", error.message)
            return { ok: false, msg: "Error al registrar el usuario." }
        }
    }


    // actualiza usuario (PUT)
    actualizarUsuario = async (usuario) => {
        try {
            const { data } = await axios.put(this.#url + usuario.id, usuario)
            return { data }
        } catch (error) {
            console.error('Error actualizarUsuario', error.message)
            throw error
        }
    }
}

export default ServicioUsuarios