import axios from "axios"

class ServicioLibros {
    #url = ''

    constructor() {
        this.#url = 'https://69164899a7a34288a27cee7e.mockapi.io/api/Libros/'
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

    delete = async id => {
        try {
            const { data: libroEliminado } = await axios.delete(this.#url + id)
            return libroEliminado
        }
        catch (error) {
            console.error('Error libro DELETE', error.message)
        }
    }

    post = async libro => {
        try {
            const { data: libroGuardado } = await axios.post(this.#url, libro)
            return libroGuardado
        } catch (error) {
            console.error('Error libros POST', error.message)
        }
    }
    update = async (id, libro) => {
        try {
            const { data: libroActualizado } = await axios.put(this.#url + id, libro)
            return libroActualizado
        }
        catch (error) {
            console.error('Error libros PUT', error.message)
        }
    }
}

export default ServicioLibros