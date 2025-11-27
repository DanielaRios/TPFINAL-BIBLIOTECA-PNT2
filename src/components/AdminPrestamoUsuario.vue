<template>
    <!-- Modal Préstamos Usuario -->
    <div class="modal fade" id="modalPrestamosUsuario" tabindex="-1" aria-labelledby="modalPrestamosUsuarioLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
            <div class="modal-content">

                <!-- HEADER -->
                <div class="modal-header modal-header-custom">
                    <h5 class="modal-title" id="modalPrestamosUsuarioLabel">
                        Libros Alquilados
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="blurCerrar"></button>
                </div>

                <!-- BODY -->
                <div class="modal-body" v-if="usuario">
                    <!-- Tarjeta usuario + métricas -->
                    <div class="row mb-4">

                        <!-- Usuario -->
                        <div class="col-md-6 mb-3">
                            <div class="card card-usuario">
                                <div class="card-body d-flex align-items-center">
                                    <div class="me-3 avatar-circle">
                                        <span>{{ inicialesUsuario }}</span>
                                    </div>
                                    <div>
                                        <p class="label-usuario">USUARIO</p>
                                        <h5 class="mb-0">{{ usuario.nombre }} {{ usuario.apellido }}</h5>
                                        <p class="mb-0 text-muted">{{ usuario.email }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Libros activos -->
                        <div class="col-md-3 mb-3">
                            <div class="card card-metrica border-left-blue">
                                <div class="card-body">
                                    <p class="label-metrica">LIBROS ACTIVOS</p>
                                    <h3 class="mb-0">{{ cantidadActivos }}</h3>
                                </div>
                            </div>
                        </div>

                        <!-- Libros devueltos -->
                        <div class="col-md-3 mb-3">
                            <div class="card card-metrica border-left-green">
                                <div class="card-body">
                                    <p class="label-metrica">LIBROS DEVUELTOS</p>
                                    <h3 class="mb-0">{{ cantidadDevueltos }}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Historial -->
                    <h5 class="mb-3">Historial de Préstamos</h5>

                    <div v-if="prestamosOrdenados.length === 0" class="alert alert-secondary">
                        El usuario no tiene préstamos registrados.
                    </div>

                    <div v-else class="table-responsive">
                        <table class="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Libro</th>
                                    <th class="text-center">Fecha Préstamo</th>
                                    <th class="text-center">Fecha Dev. prevista</th>
                                    <th class="text-center">Fecha Devolución</th>
                                    <th class="text-center">Días</th>
                                    <th class="text-center">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(p, index) in prestamosOrdenados" :key="index">
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img v-if="p.foto" :src="p.foto" alt="Portada libro"
                                                class="img-portada me-2" />
                                            <span>{{ p.titulo }}</span>
                                        </div>
                                    </td>
                                    <!-- Fecha préstamo -->
                                    <td class="text-center">
                                        {{ formatearFecha(p.fechaAlquiler) }}
                                    </td>

                                    <!-- NUEVA: Fecha devolución prevista -->
                                    <td class="text-center">
                                        {{ formatearFecha(p.fechaDevolucionPrevista) }}
                                    </td>

                                    <!-- Fecha devolución real -->
                                    <td class="text-center">
                                        {{ formatearFecha(p.fechaDevolucion) }}
                                    </td>

                                    <!-- Días -->
                                    <td class="text-center">
                                        <span class="badge bg-light text-dark">
                                            {{ calcularDias(p) === "-" ? "-" : calcularDias(p) + " días" }}
                                        </span>
                                    </td>


                                    <!-- Estado -->
                                    <td class="text-center">
                                        <span :class="claseBadge(estadoPrestamo(p))">
                                            {{ estadoPrestamo(p) }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Si por alguna razón no hay usuario cargado -->
                <div class="modal-body" v-else>
                    <p class="text-muted">No hay usuario seleccionado.</p>
                </div>

                <!-- FOOTER -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-cerrar-modal" data-bs-dismiss="modal" @click="blurCerrar">
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminPrestamoUsuario",

    data() {
        return {
            usuario: null,
            prestamos: [],
        };
    },

    computed: {
        prestamosOrdenados() {
            return [...this.prestamos].sort((a, b) => {
                const fa = a.fechaAlquiler ? new Date(a.fechaAlquiler) : 0;
                const fb = b.fechaAlquiler ? new Date(b.fechaAlquiler) : 0;
                return fa - fb;
            });
        },

        cantidadActivos() {
            return this.prestamos.filter((p) => p.activo).length;
        },

        cantidadDevueltos() {
            return this.prestamos.filter((p) => !p.activo && p.fechaDevolucion).length;
        },

        inicialesUsuario() {
            if (!this.usuario) return "";
            const n = (this.usuario.nombre || "").trim().charAt(0);
            const a = (this.usuario.apellido || "").trim().charAt(0);
            return (n + a).toUpperCase();
        },
    },

    methods: {

        // 1) Interpretar "YYYY-MM-DD" como fecha LOCAL (sin corrimiento por UTC)
        parseFechaLocal(fechaStr) {
            if (!fechaStr) return null;

            // Si viene con hora (ej: "2025-11-24T15:19:50.803Z"), dejamos que Date lo maneje
            if (fechaStr.includes("T")) {
                return new Date(fechaStr);
            }

            // Si viene "2025-11-10", la armamos como fecha local
            const [year, month, day] = fechaStr.split("-").map(Number);
            return new Date(year, month - 1, day);
        },

        // Lo llama el padre al hacer click en "Préstamos"
        cargarPrestamos(usuario) {
            this.usuario = { ...usuario };
            this.prestamos = Array.isArray(usuario.librosAlquilados)
                ? [...usuario.librosAlquilados]
                : [];
        },

        blurCerrar(event) {
            if (event && event.target) event.target.blur();
            // Opcional: limpiar cuando se cierra
            // this.usuario = null;
            // this.prestamos = [];
        },

        formatearFecha(fecha) {
            if (!fecha) return "-";

            const opciones = { day: "2-digit", month: "short", year: "numeric" };

            const d = this.parseFechaLocal(fecha); // usamos el helper nuevo
            if (!d) return "-";

            return d.toLocaleDateString("es-AR", opciones);
        },

        // Dias entre fecha de préstamo y devolución (o hoy si sigue activo)
        calcularDias(p) {
            // 1) Si el préstamo está devuelto → mostramos "-"
            if (p.fechaDevolucion) {
                return "-";
            }

            // 2) Si no tenemos fecha prevista, no calculamos
            if (!p.fechaDevolucionPrevista) {
                return "-";
            }

            // 3) Construimos fechas usando el helper para evitar el desfase de 1 día
            const fechaPrevista = this.parseFechaLocal(p.fechaDevolucionPrevista);
            const hoy = new Date();

            if (!fechaPrevista) return "-";

            // 4) Normalizamos ambas a medianoche
            hoy.setHours(0, 0, 0, 0);
            fechaPrevista.setHours(0, 0, 0, 0);

            // 5) Diferencia en ms y la pasamos a días (valor absoluto por las dudas)
            const diffMs = hoy - fechaPrevista;
            const dias = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));

            return dias; // en la tabla seguís usando: {{ calcularDias(p) }} días
        },



        estadoPrestamo(p) {
            // Si MockAPI ya trae estado, lo usamos
            if (p.estado) return p.estado;

            // Si tiene fechaDevolucion, lo consideramos devuelto
            if (p.fechaDevolucion) return "Devuelto";

            // Si está activo, vemos si está atrasado por la fecha prevista
            const fechaPrevista = this.parseFechaLocal(p.fechaDevolucionPrevista);
            if (!fechaPrevista) return "En Curso";

            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            fechaPrevista.setHours(0, 0, 0, 0);

            if (hoy > fechaPrevista) return "Atrasado";
            return "En Curso";
        },

        claseBadge(estado) {
            switch (estado) {
                case "Devuelto":
                    return "badge bg-dark";
                case "Atrasado":
                    return "badge bg-danger";
                default:
                    return "badge bg-secondary";
            }
        },
    },
};
</script>

<style scoped>
.modal-content {
    background-color: #f8f9fa;
    border-radius: 10px;
}

/* HEADER */
.modal-header-custom {
    background-color: #1A1F2E;
    color: white;
}

.modal-header-custom .btn-close {
    filter: invert(1);
    opacity: 1;
}

/* Tarjeta usuario */
.card-usuario {
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.avatar-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #e3f2fd;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #1A1F2E;
    font-size: 1.1rem;
}

.label-usuario {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: #6c757d;
    margin-bottom: 2px;
}

/* Métricas */
.card-metrica {
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.label-metrica {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: #6c757d;
    margin-bottom: 4px;
    font-weight: 500;
}

/*Libros activos */
.border-left-blue {
    border-left: 4px solid #a64d79;
}

/*Libros devueltos */
.border-left-green {
    border-left: 4px solid #000000;
}

/* Portada libro */
.img-portada {
    width: 32px;
    height: 48px;
    object-fit: cover;
    border-radius: 4px;
}

/* Botón cerrar */
.btn-cerrar-modal {
    padding: 8px 20px;
    font-size: 0.95rem;
    border-radius: 8px;
    border: 1px solid #6c757d;
    background-color: transparent;
    color: #6c757d;
    transition: all 0.3s ease;
}

.btn-cerrar-modal:hover {
    background-color: #1A1F2E;
    color: white;
}
</style>
