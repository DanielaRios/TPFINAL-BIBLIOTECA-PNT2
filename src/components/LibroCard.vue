<template>
  <div class="componente">
    <div class="card" style="width: 16rem;">
      <img :src="libro.foto" class="card-img-top" style="height: 20rem; object-fit: cover;" alt="portada del libro">
      <div class="card-body">
        <h5 class="card-title">{{ libro.titulo }}</h5>
        <div class="container card-text">
          <div class="row">
            <div class="col-12"><p>{{ libro.autor }}</p></div>
          </div>
          <div class="row">
            <div class="col-9"><p>{{ libro.categoria }}</p></div>
            <div class="col-3"><p>{{ stock }}</p></div>
          </div>
          <div class="row">
            <div>
              <span class="badge rounded-pill bg-dark mb-2">Stock: {{ stock }}</span>
            </div> 
          </div>
          <div class="row">
            <div class="col-12 d-grid">
              <!-- Ahora abre la confirmación en lugar de alquilar directo -->
              <button class="btn btn-primary" @click="mostrarConfirmacion = true" :disabled="chequearStock">
                Alquilar
              </button>
            </div>  
          </div>
        </div>            
      </div>
    </div>

    <!-- Componente de confirmación -->
    <ConfirmacionAlquiler 
      v-if="mostrarConfirmacion" 
      :libro="libro" 
      @cerrar="mostrarConfirmacion = false; stock--"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import ConfirmacionAlquiler from './ConfirmacionAlquiler.vue';

export default {
  name: 'LibroCard',
  components: { ConfirmacionAlquiler },
  props: {
    libro: { type: Object, required: true }
  },
  setup(props) {
    const stock = ref(props.libro.stock);
    const mostrarConfirmacion = ref(false);

    const chequearStock = computed(() => stock.value <= 0);

    return { stock, mostrarConfirmacion, chequearStock };
  }
};
</script>

<style scoped>
.btn-primary{ 
  background-color: #1A1F2E;
}
.container {
  padding: 0;
}
.card-text{
  color: gray;
}
</style>
