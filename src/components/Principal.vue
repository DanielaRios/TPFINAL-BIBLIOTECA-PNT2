<template>
    <div class="componente">
       <div class="container mt-4">
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                <div class="col" v-for="libro in libros" :key="libro.id">
                <LibroCard :libro="libro" />
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import LibroCard from './LibroCard.vue';
import ServicioLibros from "@/Servicios/libros";

export default {
    name: 'Principal', // cambiá el nombre si querés  
    
    components: {
        LibroCard
    },
    props: {

    },
    data() {
        return {
            servicioLibros: new ServicioLibros(),
            libros: [],
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
        },
    },
    mounted() {
    // se llama automáticamente cuando se monta el componente
        this.obtener();
    },
} 
</script>


<style scoped>
.componente{
    background-color: #F8F8F8;
}
</style>