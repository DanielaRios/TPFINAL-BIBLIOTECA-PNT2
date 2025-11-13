<template>
    <nav class="navbar navbar-expand-md mb-1">
        <!-- Maneja el tamaño y color de la barra de navegación -->
        <div class="container-fluid">
            <RouterLink class="navbar-brand" to="/">Biblioteca - Lectia </RouterLink>

            <!-- Botón hamburguesa para pantallas pequeñas -->
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Items de navegación - opciones -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">

                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/principal">Principal</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/login">Login</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/admin">Admin</RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink class="nav-link" to="/user">Usuario</RouterLink>
                    </li>

                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar', // cambiá el nombre si querés

    // Registrar componentes hijos
    components: {
        // Ej: HijoComponente
    },

    // Propiedades que recibe el componente
    props: {
        // ejemplo: titulo: { type: String, default: '' }
    },

    // Estado local
    data() {
        return {
        };
    },

    // Propiedades computadas
    computed: {
        // ejemplo: doble() { return this.contador * 2; }
    },

    // Observadores
    watch: {
        // ejemplo: contador(nuevo, viejo) { /* ... */ }
    },

    // Métodos
    methods: {
        // ejemplo: incrementar() { this.contador++; }
    },

    // Ciclo de vida
    created() {
        // Se ejecuta al crear la instancia
    },
    mounted() {
        // Se ejecuta cuando el componente se monta en el DOM
    },
    unmounted() {
        // Limpieza al desmontar
    }
};
</script>

<style scoped>
.navbar {
  background-color: #1A1F2E;
  
}
.navbar-brand,
.nav-link {
  color: white !important;
}

/* Hover opcional */
.nav-link:hover {
  color: #cccccc !important;
}

/* Icono menú hamburguesa en blanco */
.navbar-toggler {
  border-color: white !important;
}

.navbar-toggler-icon {
  filter: invert(1); /* convierte el icono a blanco */
}

</style>
