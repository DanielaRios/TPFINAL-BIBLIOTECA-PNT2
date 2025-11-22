<template>
    <h2> VISTA USUARIOS PARA ADMIN</h2>

    <!--Filtros -->
    <div class="card mb-3 filtro-card">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <!-- Buscar (Título/Autor) -->
                <div class="col-12 col-lg-5">
                    <label class="form-label fs-5"><strong>Buscar Usuario</strong></label>
                    <input type="text" class="form-control" v-model="filtroTexto" placeholder="Buscar usuario..." />
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
                            <li><button class="dropdown-item" @click="setCategoria('Ficción')">Ficción</button>
                            </li>
                            <li><button class="dropdown-item" @click="setCategoria('Ciencia')">Ciencia</button>
                            </li>
                            <li><button class="dropdown-item" @click="setCategoria('Historia')">Historia</button></li>
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
                            <li><button class="dropdown-item" @click="setEstado('NoDisponible')">No
                                    disponible</button></li>
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
</script>

<style scoped></style>