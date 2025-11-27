<template>
    <div class="vista">
        <div class="container my-4">
            <div class="mb-4">
                <h1>Catálogo de Libros</h1>
            </div>
            <FiltroLibros @filtrar="aplicarFiltros" @reset="resetFiltros" @cambio-texto="filtrarPorTexto" />
            <!-- Si el filtro dejó 0 resultados -->
            <div v-if="librosFiltrados.length === 0" class="alert alert-secondary text-center mt-3">
                No se encontro ningún libro
            </div>
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                <div class="col" v-for="libro in librosFiltrados" :key="libro.id">
                <LibroCard :libro="libro" />
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import LibroCard from './LibroCard.vue';
import ServicioLibros from "@/Servicios/libros";
import FiltroLibros from './common/FiltroLibros.vue';

export default {
    name: 'Principal', // cambiá el nombre si querés  
    
    components: {
        LibroCard,
        FiltroLibros
    },
    props: {

    },
    data() {
        return {
            servicioLibros: new ServicioLibros(),
            libros: [],
            librosFiltrados: [],
            filtroTexto: '',
            filtroCategoria: 'Todas',
            filtroEstado: 'Todos',
        };
    },
    // Propiedades computadas  
    computed: {

    },

    // Métodos  
    methods: {
         async obtener() {
            const libros = await this.servicioLibros.getAll()
            this.libros = libros
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
    },
    mounted() {
    // se llama automáticamente cuando se monta el componente
        this.obtener();
    },
} 
</script>


<style scoped>

</style>