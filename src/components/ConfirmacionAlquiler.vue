<template>
  <div class="vista">
    <div class="container my-5">
      <!-- Pantalla de confirmación inicial -->
      <div v-if="!alquilerExitoso" class="overlay">
        <div class="swipe-up">
          <img :src="libro.foto" class="rounded mb-3" style="width: 80px; height: 110px; object-fit: cover;" alt="portada">
          <h2 class="mb-3">Confirmar tu Alquiler</h2>
          <p><strong>Título:</strong> {{ libro.titulo }}</p>
          <p><strong>Autor:</strong> {{ libro.autor }}</p>
          <p><strong>Descripción:</strong> {{ libro.descripcion || 'Sin descripción disponible.' }}</p>
          <p><strong>Fecha estimada de devolución:</strong> {{ fechaDevolucion }}</p>
          <p class="text-muted"><em>El alquiler dura 15 días. Se aplican cargos por devolución tardía.</em></p>

          <div class="d-flex justify-content-between mt-4">
            <button class="btn btn-secondary" @click="volver">Volver al Catálogo</button>
            <button class="btn btn-primary" @click="confirmarAlquiler">Confirmar Alquiler</button>
          </div>
        </div>
      </div>

      <!-- Modal de alquiler exitoso -->
      <div v-else class="overlay">
        <div class="swipe-up">
          <div class="mb-3">
            <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
          </div>
          <h3 class="mb-3">¡Disfrutá tu lectura!</h3>
          <p class="text-muted mb-4">Recibirás un correo con todos los detalles de tu préstamo.</p>

          <div class="d-flex align-items-center mb-3">
            <img :src="libro.foto" alt="portada" style="width: 60px; height: 90px; object-fit: cover; margin-right: 10px;">
            <div class="text-start">
              <p class="mb-0"><strong>{{ libro.titulo }}</strong></p>
              <small class="text-muted">{{ libro.autor }}</small>
            </div>
          </div>

          <p class="mb-4"><strong>Fecha de devolución:</strong> {{ fechaDevolucion }}</p>

          <div class="d-flex justify-content-between">
            <button class="btn btn-primary" @click="irHistorial">Ir a Mis Alquileres</button>
            <button class="btn btn-secondary" @click="volver">Volver al Catálogo</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/usuario';
import { useLibrosStore } from '@/stores/libros';

export default {
  name: 'ConfirmacionAlquiler',
  props: {
    libro: { type: Object, required: true }
  },
  emits: ['cerrar'],
  data() {
    return {
      userStore: useUserStore(),
      librosStore: useLibrosStore(),
      fechaDevolucion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      alquilerExitoso: false
    };
  },
  methods: {
    async confirmarAlquiler() {
      const user = this.userStore.getUsuario;

      if (!user) {
        this.$router.push('/login');
        return;
      }

      if (this.libro.stock <= 0) {
        alert("No hay stock disponible para este libro.");
        return;
      }

    
      const activos = (user.librosAlquilados || []).filter(l => l.activo && l.estado === "En Curso").length
      console.log(activos)
      
      if (activos >= 15) {
        alert("No podés alquilar más de 15 libros activos.");
        return;
      }

      // Verificar si el libro ya está alquilado en curso o retrasado
      const yaAlquilado = (user.librosAlquilados || []).some(
        l => (l.libroID ?? l.libroId) === this.libro.id && (l.estado === "En Curso" || l.estado === "Retrasado")
      );

      if (yaAlquilado) {
        alert("Ya tenés este libro alquilado en curso o retrasado. No podés volver a alquilarlo.");
        return;
      }


      const nuevoPrestamo = {
        usuarioId: user.id,
        libroID: this.libro.id,
        titulo: this.libro.titulo,
        foto: this.libro.foto || '',
        fechaAlquiler: new Date().toISOString().split('T')[0],
        fechaDevolucionPrevista: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fechaDevolucion: null,
        activo: true,
        estado: "En Curso"
      };

      const librosActualizados = [...(user.librosAlquilados || []), nuevoPrestamo];

      try {
        const res = await this.userStore.actualizarUsuario({
          ...user,
          librosAlquilados: librosActualizados
        });
        

        await this.librosStore.actualizarStock(this.libro.id, this.libro.stock - 1);

        this.alquilerExitoso = true; // Mostrar pantalla de confirmación exitosa
      } catch (error) {
        console.error("Error al alquilar:", error);
        alert("No se pudo completar el alquiler.");
      }
    },
    volver() {
      this.$emit('cerrar');
    },
    irHistorial() {
      this.$emit('cerrar');
      this.$router.push('/user');
    }
  }
};
</script>

<style scoped>
.card-title {
  color: #1A1F2E;
}

.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.45);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swipe-up {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem;
  animation: slideUp 0.35s ease-out forwards;
}

@keyframes slideUp {
  from {
    transform: translateY(60px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
