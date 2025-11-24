<template>
  <div class="vista">
    <div class="container my-5">
      <div class="card mx-auto text-center" style="max-width: 400px;">
        <div class="card-body">
          <!-- Icono de confirmación -->
          <div class="mb-3">
            <span class="confirm-icon">✔️</span>
          </div>
          <!-- Mensaje principal -->
          <h2 class="card-title mb-3">¡Disfruta tu lectura!</h2>

          <!-- Información del libro -->
          <img :src="libro.foto" class="img-thumbnail mb-3" style="height: 12rem; object-fit: cover;" alt="portada">
          <p><strong>Título:</strong> {{ libro.titulo }}</p>
          <p><strong>Autor:</strong> {{ libro.autor }}</p>
          <p><strong>Fecha de devolución:</strong> {{ fechaDevolucion }}</p>
          <p class="text-muted"><em>Recibirás un correo con los detalles de tu préstamo.</em></p>

          <!-- Acciones -->
          <div class="d-flex justify-content-around mt-4">
            <button class="btn btn-primary" @click="irHistorial">Ir a Mis Alquileres</button>
            <button class="btn btn-secondary" @click="$emit('cerrar')">Volver al Catálogo</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AlquilerConfirmado',
  props: {
    libro: { type: Object, required: true }
  },
  setup(props) {
    // Fecha de devolución: 21 días desde hoy
    const fechaDevolucion = ref(
      new Date(Date.now() + 21*24*60*60*1000).toLocaleDateString()
    );

    const irHistorial = () => {
      // Emitimos evento para que el padre navegue a la vista de usuario/historial
      // Esto se puede integrar con Vue Router si lo tenés
      alert("Redirigiendo a Mis Alquileres (implementá la navegación según tu proyecto)");
    };

    return { fechaDevolucion, irHistorial };
  }
};
</script>

<style scoped>
.card-title {
  color: #1A1F2E;
}
.confirm-icon {
  font-size: 3rem;
  color: green;
}
</style>
