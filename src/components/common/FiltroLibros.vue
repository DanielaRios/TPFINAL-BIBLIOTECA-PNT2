<template>

    <!-- Filtros -->
    <div class="card mb-3 filtro-card">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <!-- Buscar (Título/Autor) -->
                <div class="col-12 col-lg-5">
                    <label class="form-label fs-5"><strong>Buscar (Título/Autor)</strong></label>
                    <input type="text" class="form-control" v-model="filtroTexto" placeholder="Buscar libro..."
                        @input="cambioTexto" />
                </div>

                <!-- Categoría -->
                <div class="col-6 col-lg-3">
                    <label class="form-label fs-5"><strong>Categoría</strong></label>
                    <div class="dropdown filtro-dropdown">
                        <button class="btn btn-dark dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                            {{ filtroCategoriaMostrar }}
                        </button>
                        <ul class="dropdown-menu">
                            <li><button class="dropdown-item" @click="setCategoria('Todas')">Todas</button></li>
                            <li><button class="dropdown-item" @click="setCategoria('Ficción')">Ficción</button></li>
                            <li><button class="dropdown-item" @click="setCategoria('Fantasía')">Fantasía</button></li>
                            <li><button class="dropdown-item" @click="setCategoria('Romance')">Romance</button></li>
                            <li><button class="dropdown-item" @click="setCategoria('Misterio')">Misterio</button></li>
                            <li><button class="dropdown-item" @click="setCategoria('Ciencia ficción')">Ciencia
                                    ficción</button></li>

                        </ul>
                    </div>
                </div>

                <!-- Estado -->
                <div class="col-6 col-lg-2">
                    <label class="form-label fs-5"><strong>Estado</strong></label>
                    <div class="dropdown filtro-dropdown">
                        <button class="btn btn-dark dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                            {{ filtroEstadoMostrar }}
                        </button>
                        <ul class="dropdown-menu">
                            <li><button class="dropdown-item" @click="setEstado('Todos')">Todos</button></li>
                            <li><button class="dropdown-item" @click="setEstado('Disponible')">Disponible</button></li>
                            <li><button class="dropdown-item" @click="setEstado('NoDisponible')">No disponible</button></li>
                        </ul>
                    </div>
                </div>

                <!-- Botones -->
                <div class="col-12 col-lg-2 d-flex justify-content-center gap-2">
                    <button class="btn btn-dark" @click="aplicarFiltros">Filtrar</button>
                    <button class="btn btn-outline-dark" @click="resetFiltros">Reset</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'FiltroLibros',
    
    data() {
        return {
            filtroTexto: '',
            filtroCategoria: 'Todas',
            filtroEstado: 'Todos'
        }
    },
    computed: {
        filtroCategoriaMostrar() {
            return this.filtroCategoria
        },
        filtroEstadoMostrar() {
            if (this.filtroEstado === 'Todos') return 'Todos'
            if (this.filtroEstado === 'Disponible') return 'Disponible'
            return 'No disponible'
        }
    },
    methods: {
        setCategoria(valor) {
            this.filtroCategoria = valor
        },
        setEstado(valor) {
            this.filtroEstado = valor
        },
        aplicarFiltros() {
            // Aviso al padre cuales son los filtros elegidos
            this.$emit('filtrar', {
                texto: this.filtroTexto,
                categoria: this.filtroCategoria,
                estado: this.filtroEstado
            })
        },
        resetFiltros() {
            this.filtroTexto = ''
            this.filtroCategoria = 'Todas'
            this.filtroEstado = 'Todos'
            // Aviso al padre que se reseteo
            this.$emit('reset')
        },
        // Emite solo el texto para filtrar en vivo
        cambioTexto() {
            this.$emit('cambio-texto', this.filtroTexto)
        }
    }
}
</script>

<style scoped>

/* --- Dropdown general  --- */
.filtro-dropdown {
    width: 100%;
}

/* Botones de los dropdowns al 100% */
.filtro-dropdown .btn {
    width: 100%;
    height: 45px;
    /* antes era 55px con btn-lg */
    font-size: 1rem;
    /* más chico que el 1.1rem anterior */
}

/* ---- Estilo general del bloque de filtros ---- */
.filtro-card {
    background-color: #f8f9fa;
    /* gris muy claro */
    border-radius: 8px;
}

/* Alinea todos los campos abajo */
.filtro-card .row {
    align-items: flex-end;
}

/* Input busqueda con altura pareja con los botones */
.filtro-card input.form-control {
    height: 45px;
    /* igual a los botones */
    font-size: 1rem;
    padding: 8px 12px;
    margin-bottom: 0;
    /* no hay botón debajo */
}

/* Botones Filtrar / Reset */
.filtro-card .btn {
    min-width: 100px;
    height: 45px;
    font-size: 1rem;
}

/* Responsivo */
@media (max-width: 991px) {
    .filtro-card .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
}
</style>