<template>
    <!-- Filtros -->
    <div class="card mb-3 filtro-card">
        <div class="card-body">
            <div class="row g-3 align-items-end">
                <!-- Buscar Usuario -->
                <div class="col-12 col-md-12 col-lg-4">
                    <label class="form-label fs-5"><strong>Buscar Usuario</strong></label>
                    <input type="text" class="form-control" v-model="filtroTexto"
                        placeholder="Buscar por nombre, apellido, usuario o email..." />
                </div>

                <!-- Filtro por préstamos -->
                <div class="col-6 col-md-6 col-lg-2">
                    <label class="form-label fs-5"><strong>Préstamos</strong></label>
                    <div class="dropdown filtro-dropdown">
                        <button class="btn btn-dark dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                            {{ filtroPrestamosMostrar }}
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <button class="dropdown-item" @click="setFiltroPrestamos('Todos')">
                                    Todos
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item" @click="setFiltroPrestamos('ConActivos')">
                                    Con préstamos activos
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item" @click="setFiltroPrestamos('SinActivos')">
                                    Sin préstamos activos
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <h1>Lista de Usuarios</h1>

    <hr />

    <!-- Si MockAPI no trajo Usuarios -->
    <div v-if="usuarios.length === 0">
        <h4 class="alert alert-secondary">Cargando usuarios desde MockAPI...</h4>
    </div>

    <!-- Cuando MockAPI ya cargo Usuarios -->
    <div v-else>
        <!-- Si el filtro dejó 0 resultados -->
        <div v-if="usuariosFiltrados.length === 0" class="alert alert-secondary text-center mt-3">
            No se encontro ningún usuario
        </div>
        <!-- Tabla de usuarios -->
        <div v-else class="table-responsive">
            <table class="table tabla-usuarios align-middle">
                <thead>
                    <tr>
                        <th class="text-center">#ID</th>
                        <th>NOMBRE</th>
                        <th>APELLIDO</th>
                        <th>DNI</th>
                        <th>USERNAME</th>
                        <th>PASSWORD</th>
                        <th>EMAIL</th>
                        <th class="text-center">PRESTAMOS ACTIVOS</th>
                        <th>HISTORIAL</th>
                        <th>ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
                        <td class="text-center">{{ usuario.id }}</td>
                        <td><b>{{ usuario.nombre }}</b></td>
                        <td><b>{{ usuario.apellido }}</b></td>
                        <td> {{ usuario.dni }} </td>
                        <td> {{ usuario.userName }}</td>
                        
                        <td class="text-center">{{ "•".repeat(usuario.password.length) }}</td>
                        <td class="text-center">{{ usuario.email }}</td>
                        <!-- Contamos préstamos desde librosAlquilados -->
                        <td class="text-center">
                            {{ contarPrestamosActivos(usuario) }}
                        </td>
                        <td>
                            <!-- Botón todavía sin funcionalidad -->
                            <button class="btn btn-dark my-1 me-2" disabled>
                                Prestamos
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-dark my-1 me-2" data-bs-toggle="modal"
                                data-bs-target="#modalEditarUsuario" @click="editarUsuario(usuario)">
                                Editar
                            </button>


                            <button class="btn btn-color-eliminar my-1 me-2"
                                @click="eliminarUsuario(usuario.id, usuario.esAdmin)">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Modal Editar Usuario -->
            <AdminEditarUsuario ref="modalEditarUsuario" @usuario-editado="actualizarUsuarioEditado" />

        </div>
    </div>
</template>

<script>
import ServicioUsuarios from "@/Servicios/usuarios";
import AdminEditarUsuario from "@/components/AdminEditarUsuario.vue";


export default {
    name: "AdminUsers",

    components: {
        AdminEditarUsuario,
    },

    data() {
        return {
            servicioUsuarios: new ServicioUsuarios(),
            usuarios: [],

            filtroTexto: "",
            filtroPrestamos: "Todos", // 'Todos' | 'ConActivos' | 'SinActivos'
        };
    },

    computed: {
        filtroPrestamosMostrar() {
            switch (this.filtroPrestamos) {
                case "ConActivos":
                    return "Con préstamos activos";
                case "SinActivos":
                    return "Sin préstamos activos";
                default:
                    return "Todos";
            }
        },

        usuariosFiltrados() {
            const texto = this.filtroTexto.trim().toLowerCase();

            return this.usuarios.filter((u) => {

                // Nunca mostrar al admin
                if (u.esAdmin) {
                    return false;
                }
                // --- filtro por texto ---
                const nombre = (u.nombre || "").toLowerCase();
                const apellido = (u.apellido || "").toLowerCase();
                const userName = (u.userName || "").toLowerCase();
                const email = (u.email || "").toLowerCase();

                const coincideTexto =
                    !texto ||
                    nombre.includes(texto) ||
                    apellido.includes(texto) ||
                    userName.includes(texto) ||
                    email.includes(texto);

                if (!coincideTexto) return false;

                // --- filtro por préstamos ---
                const activos = this.contarPrestamosActivos(u);

                if (this.filtroPrestamos === "ConActivos") {
                    return activos > 0;
                }
                if (this.filtroPrestamos === "SinActivos") {
                    return activos === 0;
                }

                return true;
            });
        },
    },

    methods: {
        async obtenerUsuarios() {
            try {
                const data = await this.servicioUsuarios.getAll();
                this.usuarios = (data || []).map(u => ({
                    ...u,
                    mostrarPass: false   // propiedad para la tabla
                }));
            } catch (error) {
                console.error("Error al obtener usuarios:", error.message);
            }
        },

        contarPrestamosActivos(usuario) {
            return (usuario.librosAlquilados || []).filter((p) => p.activo).length;
        },



        setFiltroPrestamos(valor) {
            this.filtroPrestamos = valor;
        },

        // ELIMINAR USUARIO
        async eliminarUsuario(id, esAdmin) {
            // Por seguridad: no permitir borrar al admin
            if (esAdmin) {
                alert("No se puede eliminar el usuario administrador.");
                return;
            }

            if (!confirm("¿Seguro que desea eliminar el usuario con ID " + id + "?")) {
                return;
            }

            try {
                // 1) Eliminar en el servidor (MockAPI)
                const usuarioEliminado = await this.servicioUsuarios.delete(id);
                console.log("Usuario eliminado en MockAPI:", usuarioEliminado);

                // 2) Eliminar del array local (lista original)
                const index = this.usuarios.findIndex((u) => u.id == id);
                if (index !== -1) {
                    this.usuarios.splice(index, 1);
                }
            } catch (error) {
                console.error("Error al eliminar usuario:", error.message);
                alert("Ocurrió un error al eliminar el usuario.");
            }
        },

        // EDITAR 

        editarUsuario(usuario) {
            if (this.$refs.modalEditarUsuario) {
                this.$refs.modalEditarUsuario.cargarUsuario(usuario);
            }
        },

        // ACTUALIZAR USUARIO EDITADO
        actualizarUsuarioEditado(usuarioActualizado) {
            const index = this.usuarios.findIndex(
                (u) => u.id == usuarioActualizado.id
            );
            if (index !== -1) {
                this.usuarios.splice(index, 1, usuarioActualizado);
            }
        },

    },

    mounted() {
        this.obtenerUsuarios();
    },
};
</script>

<style scoped>
/* ---- Estilo general del bloque de filtros ---- */

/* Dropdown general*/
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

/* ---- Estilo general para tabla ---- */

.tabla-usuarios thead {
    background-color: #1A1F2E;
}

.tabla-usuarios thead th {
    background-color: #1A1F2E;
    color: #ffffff;
    font-weight: 600;
}


/* Filas del cuerpo en gris claro */
.tabla-usuarios tbody td {
    background-color: #f0f4f7;
}

/* Botón eliminar personalizado */
.btn-color-eliminar {
    background-color: #a64d79;
    color: white;
}
</style>
