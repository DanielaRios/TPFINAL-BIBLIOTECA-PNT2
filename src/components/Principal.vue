<template>
    <div class="componente">
        <h2>Principal</h2>
        
        <div class="lista-libros">
            <LibroCard 
                v-for="libro in libros"
                :key="libro.id"
                :libro="libro"
            />
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

</style>