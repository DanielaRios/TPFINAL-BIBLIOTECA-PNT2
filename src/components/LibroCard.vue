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
              <button class="btn btn-primary" @click="alquilar" :disabled="chequearDisponible">Alquilar</button>
            </div>  
          </div>
        </div>            
      </div>
    </div>
    <ConfirmacionAlquiler
      v-if="mostrarConfirmacion"
      :libro="libro"
      @cerrar="mostrarConfirmacion = false" 
     />    
  </div>
</template>

<script>
import { useUserStore } from '@/stores/usuario';
import { useLibrosStore } from '@/stores/libros';
import ConfirmacionAlquiler from './ConfirmacionAlquiler.vue';

export default {
  name: 'LibroCard',
  components: { ConfirmacionAlquiler },
  props: {
    libro: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      userStore: useUserStore(),
      librosStore: useLibrosStore(),
      stock: this.libro.stock,
      mostrarConfirmacion: false
    };
  },
  computed: {
    chequearDisponible() {
      return !this.libro.disponibilidad || this.stock <= 0   ;
    }
  },
  methods: {
    async alquilar() {
      const user = this.userStore.getUsuario;

      if (!this.userStore.getLogeado) {
        this.$router.push('/login');
        return;
      }

      if (this.userStore.getAdmin) {
        alert("El administrador no puede alquilar libros.");
        return;
      }

      const activos = (user.librosAlquilados || []).filter(l => l.activo).length;
      if (activos >= 15) {
        alert("No podés alquilar más de 15 libros activos.");
        return;
      }

      if (this.stock <= 0) {
        alert("No hay stock disponible para este libro.");
        return;
      }

      this.mostrarConfirmacion = true;

      const nuevoPrestamo = {
        libroID: this.libro.id,
        foto: this.libro.foto || '',
        titulo: this.libro.titulo,
        fechaAlquiler: new Date().toISOString().split('T')[0],
        fechaDevolucionPrevista: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0],
        fechaDevolucion: null,
        activo: true,
        estado: "En Curso"
      };

      const librosActualizados = [...(user.librosAlquilados || []), nuevoPrestamo];

      try {
        // Actualizamos usuario
        const res = await this.userStore.servicioUsuarios.actualizarUsuario({
          ...user,
          librosAlquilados: librosActualizados
        });
        

        // Reducimos stock en API y store
        await this.librosStore.actualizarStock(this.libro.id, this.stock - 1);
        this.stock--; // Actualizamos localmente

      } catch (error) {
        console.error("Error al alquilar el libro:", error);
        alert("No se pudo completar el alquiler. Intente nuevamente.");
      }
    }
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
