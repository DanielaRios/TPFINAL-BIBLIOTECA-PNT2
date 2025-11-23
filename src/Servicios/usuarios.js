import axios from "axios"

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

    autenticacion = async (user, pass) => {
        console.log("usuario: "+ user)
        console.log("password: "+ pass)
        try { 
            const { data: usuarios } = await axios.get(this.#url)
            console.log(usuarios)
            const userData = usuarios.find(
                u => u.userName === user.trim() && u.password === pass
             )
            console.log(userData)
            return  userData ?? null
        }
        catch (error) {
            console.error('Error en autenticacion', error.message)
        }
    }

    registrar = async (nuevoUsuario) => {
        try {
            const usuarios = await this.getAll()
            const existe = usuarios.some(u => u.userName === nuevoUsuario.userName.trim())

            if (existe) {
                return { ok: false, msg: "El usuario ya existe" }
            }

            const { data } = await axios.post(this.#url, nuevoUsuario)

            return { ok: true, data }
        }
        catch (error) {
            console.error("Error en registrar", error.message)
            return { ok: false, msg: "El usuario ya existe" + error.message }
        }
    }
}

export default ServicioUsuarios