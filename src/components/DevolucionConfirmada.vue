<template>
  <section class="container text-center py-5">

    <!-- Ícono de éxito -->
    <div class="mb-4">
      <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
    </div>

    <h2 class="mb-3">¡Devolución Completada!</h2>

    <p class="text-muted mb-4">
      El libro <strong>"{{ titulo}}"</strong> fue devuelto correctamente.
    </p>

    <!-- Botones -->
    <div class="mt-4">
      <button class="btn btn-dark rounded-pill px-4 me-3"
              @click="$router.push('/catalogo')">
        Ir al Catálogo
      </button>

      <button class="btn btn-outline-dark rounded-pill px-4"
              @click="$router.push('/user')">
        Volver a Mis Alquileres
      </button>
    </div>

  </section>
</template>

<script>
export default {
  name: "DevolucionConfirmada",
  computed:{
    titulo() {
      return this.$route.params.titulo || 'Libro';
    }
  }
};
</script>

<style scoped>
section {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
