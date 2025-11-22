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
}

export default ServicioUsuarios