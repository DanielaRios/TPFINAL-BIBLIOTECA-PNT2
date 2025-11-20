<template>
    <div class="componente">
        <h2>Principal</h2>
        
        <LibroCard></LibroCard>
    </div>

</template>

<script>
import LibroCard from './LibroCard.vue';

export default {
    name: 'Principal', // cambiá el nombre si querés  
    
    components: {
        LibroCard
    },
    props: {

    },
    data() {
        return {

        };
    },
    // Propiedades computadas  
    computed: {

    },

    // Métodos  
    methods: {
        
    },
} 
</script>


<style scoped>

</style>