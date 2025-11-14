import axios from "axios"

class ServicioLibros {
    #url = ''

    constructor() {
        this.#url = 'https://69164899a7a34288a27cee7e.mockapi.io/api/Libros'
    }

    getAll = async () => {
        try {
            const { data: libros } = await axios.get(this.#url)
            return libros
        }
        catch (error) {
            console.error('Error libros GET', error.message)
        }
    }
}

export default ServicioLibros