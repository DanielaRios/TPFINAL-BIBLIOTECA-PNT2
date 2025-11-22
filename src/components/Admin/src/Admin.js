import ServicioLibros from "@/Servicios/libros";
import FiltroLibros from '@/components/common/FiltroLibros.vue'

export default {
    name: 'Admin',

    components: {
        FiltroLibros
    },

    data() {
        return {
            // 👇 importante: instanciar el servicio
            servicioLibros: new ServicioLibros(),

            libros: [],
            librosFiltrados: [],
            filtroTexto: '',
            filtroCategoria: 'Todas',
            filtroEstado: 'Todos'
        };
    },

    computed: {
        filtroCategoriaMostrar() {
            return this.filtroCategoria;
        },
        filtroEstadoMostrar() {
            return this.filtroEstado;
        },
    },

    methods: {
        async obtener() {
            const libros = await this.servicioLibros.getAll()
            this.libros = libros
            // para que la tabla tenga algo al inicio
            this.librosFiltrados = libros
        },

        aplicarFiltros(filtros) {
            this.filtroTexto = filtros.texto
            this.filtroCategoria = filtros.categoria
            this.filtroEstado = filtros.estado
            this.filtrarLibros()
        },

        resetFiltros() {
            this.filtroTexto = ''
            this.filtroCategoria = 'Todas'
            this.filtroEstado = 'Todos'
            this.librosFiltrados = this.libros
        },

        // Solo para el buscador en vivo
        filtrarPorTexto(texto) {
            this.filtroTexto = texto
            this.filtrarLibros()
        },

        filtrarLibros() {
            const texto = this.filtroTexto.toLowerCase()

            this.librosFiltrados = this.libros.filter(libro => {
                const coincideTexto =
                    !texto ||
                    libro.titulo.toLowerCase().includes(texto) ||
                    libro.autor.toLowerCase().includes(texto)

                const coincideCategoria =
                    this.filtroCategoria === 'Todas' ||
                    libro.categoria === this.filtroCategoria

                const coincideEstado =
                    this.filtroEstado === 'Todos' ||
                    (this.filtroEstado === 'Disponible' && libro.disponibilidad) ||
                    (this.filtroEstado === 'NoDisponible' && !libro.disponibilidad)

                return coincideTexto && coincideCategoria && coincideEstado
            })
        },
        async eliminarLibro(id) {
            if (confirm('¿Seguro que desea eliminar el libro con ID ' + id + '?')) {

                // 1) eliminar en el servidor (MockAPI)
                const libroEliminado = await this.servicioLibros.delete(id)
                console.log('Eliminado en MockAPI:', libroEliminado)

                // 2) eliminar en el array local original
                const indexOriginal = this.libros.findIndex(l => l.id == id)
                if (indexOriginal !== -1) {
                    this.libros.splice(indexOriginal, 1)
                }

                // 3) eliminar en el array filtrado (tabla)
                const indexFiltrado = this.librosFiltrados.findIndex(l => l.id == id)
                if (indexFiltrado !== -1) {
                    this.librosFiltrados.splice(indexFiltrado, 1)
                }
            }
        }
    },

    mounted() {
        this.obtener();
    },



}
