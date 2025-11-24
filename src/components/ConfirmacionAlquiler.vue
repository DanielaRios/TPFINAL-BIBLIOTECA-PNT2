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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/usuario';
import { useLibrosStore } from '@/stores/libros';

export default {
  name: 'ConfirmacionAlquiler',
  props: {
    libro: { type: Object, required: true }
  },
  emits: ['cerrar'],
  setup(props, { emit }) {
    const router = useRouter();
    const userStore = useUserStore();
    const librosStore = useLibrosStore();

    const fechaDevolucion = ref(
      new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()
    );

    const alquilerExitoso = ref(false);

    const confirmarAlquiler = async () => {
      const user = userStore.getUsuario;

      if (!user) {
        router.push('/login')
      }

      if (props.libro.stock <= 0) {
        alert("No hay stock disponible para este libro.");
        return;
      }

      const activos = (user.librosAlquilados || []).filter(l => l.activo).length;
      if (activos >= 15) {
        alert("No podés alquilar más de 15 libros activos.");
        return;
      }

      const nuevoPrestamo = {
        usuarioId: user.id,
        libroID: props.libro.id,
        titulo: props.libro.titulo,
        foto: props.libro.foto || '',
        fechaAlquiler: new Date().toISOString().split('T')[0],
        fechaDevolucionPrevista: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
        fechaDevolucion: null,
        activo: true,
        estado: "En Curso"
      };

      const librosActualizados = [...(user.librosAlquilados || []), nuevoPrestamo];

      try {
        const res = await userStore.servicioUsuarios.actualizarUsuario({
          ...user,
          librosAlquilados: librosActualizados
        });
        userStore.usuario = res.data;

        await librosStore.actualizarStock(props.libro.id, props.libro.stock - 1);

        alquilerExitoso.value = true; // Mostrar pantalla de confirmación exitosa
      } catch (error) {
        console.error("Error al alquilar:", error);
        alert("No se pudo completar el alquiler.");
      }
    };

    const volver = () => emit('cerrar');

    const irHistorial = () => {
      emit('cerrar');        // cerrar confirmación
      router.push('/user');  // redirigir al historial de alquileres
    };

    return {
      fechaDevolucion,
      alquilerExitoso,
      confirmarAlquiler,
      volver,
      irHistorial
    };
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
  align-items: center; /* centrado vertical */
}


/* Contenedor del swipe-up */
.swipe-up {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 1.2rem;
  padding: 2rem;
  animation: slideUp 0.35s ease-out forwards;
}


/* Animación */
@keyframes slideUp {
  from {
    transform: translateY(60px); /* sube desde más abajo */
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}






</style>
