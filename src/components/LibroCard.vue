<template>
    <div class="componente">
        <div class="card" style="width: 16rem;">
            <!-- <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgkZUtSGCNDWFkOXL5nASWXJHBLCQcXx64oYObbYDRvGb3z4Ahjm8B7L3rDZ1DC3cI331hFg7ujkHmqtYQ3Z8TFR7MjJsyUxE3mpL_KtDN8yfCgbZxKWwiputIUbwJXRfrAanfUAPtOEw/w1200-h630-p-k-no-nu/1984.jpg" class="card-img-top" alt="portada del libro"> -->
            <img :src="libro.foto" class="card-img-top" style="height: 20rem; object-fit: cover;" alt="portada del libro">
            <div class="card-body">
                <h5 class="card-title">{{ libro.titulo }}</h5>
                <div class="container card-text">
                    <div class="row">
                        <div class="col-12"><p>{{ libro.autor }}</p></div>
                    </div>
                    <div class="row">
                        <div class="col-9"><p>{{ libro.categoria }}</p></div>
                        <div class="col-3"><p>{{ libro.anio }}</p></div>
                    </div>
                    <div class="row">
                        <div><span class="badge rounded-pill bg-dark mb-2">Stock: {{ stock }}</span></div> 
                    </div>
                    <div class="row">
                        <div class="col-12 d-grid"><button class="btn btn-primary" @click="alquilar" :disabled="chequearStock">Alquilar</button></div>  
                    </div>
                </div>            
            </div>
        </div>
        
    </div>
</template>

<script>
import { useUserStore } from '@/stores/usuario';

export default {
    name: 'LibroCard', 
    
    components: {

    },
    props: {
        libro:{
            type:Object,
            required:true
        }

    },
    data() {
        return {
            userStore: useUserStore(),
            imagen: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgkZUtSGCNDWFkOXL5nASWXJHBLCQcXx64oYObbYDRvGb3z4Ahjm8B7L3rDZ1DC3cI331hFg7ujkHmqtYQ3Z8TFR7MjJsyUxE3mpL_KtDN8yfCgbZxKWwiputIUbwJXRfrAanfUAPtOEw/w1200-h630-p-k-no-nu/1984.jpg',
            titulo: '1984',
            autor: 'George Orwell',
            anio: 1949,
            genero: 'Ficción',
            stock: this.libro.stock
        };
    },
    // Propiedades computadas  
    computed: {
        chequearStock(){
            return !this.stock > 0
        }
        
    },

    // Métodos  
    methods: {
        alquilar(){
            const user = this.userStore.getUsuario
            console.log(user)
            if(!this.userStore.getLogeado){
                this.$router.push('/login')
            }else if(this.userStore.getAdmin){
                Alert("Admin no puede alquilar")
            }else{
                this.stock--
            }
        },
        
    },
    created() {
        
    },
} 
</script>


<style scoped>
.btn-primary{ 
    background-color: #1A1F2E;
}
.container {
    padding: 0;
}

.card-text{
    color:gray;
}

.stock{
    background-color: #1A1F2E;
}

</style>