<template>
    <!-- Modal Editar Usuario -->
    <div class="modal fade" id="modalEditarUsuario" tabindex="-1" aria-labelledby="modalEditarUsuarioLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header modal-header-custom">
                    <h5 class="modal-title" id="modalEditarUsuarioLabel">
                        Editar Usuario
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        id="btnCerrarModalEditarUsuario" @click="blurCerrar">
                    </button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="guardarCambiosUsuario">

                        <!-- ID (solo lectura) -->
                        <div class="mb-3">
                            <label class="form-label">ID</label>
                            <input type="text" class="form-control campo-solo-lectura" v-model="usuario.id" disabled>
                        </div>

                        <div class="row">
                            <!-- USERNAME (solo lectura) -->
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Username</label>
                                <input type="text" class="form-control campo-solo-lectura" v-model="usuario.userName"
                                    disabled>
                            </div>

                            <!-- DNI (EDITABLE) -->
                            <div class="col-md-4 mb-3">
                                <label class="form-label">DNI</label>
                                <input type="number" class="form-control" v-model.number="usuario.dni"
                                    @input="usuarioDirty.dni = true">

                                <!-- Validaciones -->
                                <p v-if="usuarioDirty.dni && !usuario.dni" class="error-text">
                                    Campo requerido
                                </p>

                                <p v-else-if="usuarioDirty.dni && usuario.dni.toString().length !== 8"
                                    class="error-text">
                                    El DNI debe tener 8 dígitos
                                </p>
                            </div>

                            <!-- PASSWORD (solo lectura, con ****) -->
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Password</label>
                                <input type="text" class="form-control campo-solo-lectura" :value="maskedPassword"
                                    disabled>
                            </div>
                        </div>

                        <div class="row">
                            <!-- NOMBRE -->
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Nombre</label>
                                <input type="text" class="form-control" v-model.trim="usuario.nombre"
                                    @input="usuarioDirty.nombre = true">
                                <!--validaciones -->    
                                <p v-if="!usuario.nombre && usuarioDirty.nombre" class="error-text">
                                    Campo requerido
                                </p>
                            </div>

                            <!-- APELLIDO (editable) -->
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Apellido</label>
                                <input type="text" class="form-control" v-model.trim="usuario.apellido"
                                    @input="usuarioDirty.apellido = true">
                                <!--validaciones -->    
                                <p v-if="!usuario.apellido && usuarioDirty.apellido" class="error-text">
                                    Campo requerido
                                </p>
                            </div>

                            <!-- EMAIL (editable) -->
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" v-model.trim="usuario.email"
                                    @input="usuarioDirty.email = true">
                                <!--validaciones -->
                                <p v-if="usuarioDirty.email && !usuario.email" class="error-text">
                                    Campo requerido
                                </p>
                                <p v-else-if="usuarioDirty.email && !esEmailValido(usuario.email)" class="error-text">
                                    Email inválido
                                </p>
                            </div>
                        </div>

                        <!-- BOTONES CERRAR Y GUARDAR -->
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-cerrar-modal me-2" data-bs-dismiss="modal"
                                @click="blurCerrar">
                                Cerrar
                            </button>
                            <button type="submit" class="btn btn-guardar-modal" :disabled="usuarioInvalido">
                                Guardar cambios
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import ServicioUsuarios from "@/Servicios/usuarios";

export default {
    name: "AdminEditarUsuario",

    data() {
        return {
            servicioUsuarios: new ServicioUsuarios(),
            usuario: this.iniUsuario(),
            usuarioDirty: this.iniUsuarioDirty(),
        };
    },

    computed: {
        // Solo se valida nombre, apellido y email
        usuarioInvalido() {
            const u = this.usuario;
            const emailInvalido = !u.email || !this.esEmailValido(u.email);

            const dniInvalido =
                !u.dni ||                           // requerido
                u.dni.toString().length !== 8;      // debe tener 8 dígitos

            return !u.nombre || !u.apellido || emailInvalido || dniInvalido;
        },

        // para mostrar ***** en el input de password
        maskedPassword() {
            const pass = this.usuario.password || "";
            return "•".repeat(pass.length);
        },
    },

    methods: {
        iniUsuario() {
            return {
                id: null,
                nombre: "",
                apellido: "",
                userName: "",
                password: "",
                email: "",
                dni: null,
                
            };
        },

        iniUsuarioDirty() {
            return {
                nombre: false,
                apellido: false,
                email: false,
                dni: false,
            };
        },

        // lo llama el padre cuando clickean EDITAR
        cargarUsuario(usuario) {
            this.usuario = { ...usuario };
            this.usuarioDirty = this.iniUsuarioDirty();
        },

        resetFormulario() {
            this.usuario = this.iniUsuario();
            this.usuarioDirty = this.iniUsuarioDirty();
        },

        async guardarCambiosUsuario() {
            const usuario = { ...this.usuario };
            console.log("Editando usuario", usuario);

            const { data } = await this.servicioUsuarios.actualizarUsuario(usuario);

            if (!data) {
                alert("No se pudo actualizar el usuario en MockAPI");
                return;
            }

            // Aviso al padre que se editó un usuario
            this.$emit("usuario-editado", data);

            // Reseteo formulario
            this.resetFormulario();

            // Cierro el modal (imitando al profe)
            const btnCerrar = document.getElementById("btnCerrarModalEditarUsuario");
            if (btnCerrar) btnCerrar.click();
        },

        blurCerrar(event) {
            if (event && event.target) {
                event.target.blur();
            }
            this.resetFormulario();
        },

        esEmailValido(email) {
            if (!email) return false;
            return /\S+@\S+\.\S+/.test(email); // validación simple
        },
    },
};
</script>

<style scoped>
.modal-content {
    background-color: #f8f9fa;
    border-radius: 10px;
}

.form-label {
    font-weight: 600;
    color: #181717;
    font-size: 0.95rem;
}

.modal-header-custom {
    background-color: #1A1F2E;
    color: white;
}

.modal-header-custom .btn-close {
    filter: invert(1);
    opacity: 1;
}

.btn-cerrar-modal {
    padding: 10px 20px;
    font-size: 1rem;
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

.btn-guardar-modal {
    padding: 10px 24px;
    font-size: 1rem;
    background-color: #1A1F2E;
    color: white;
    border: none;
}

.btn-guardar-modal:disabled {
    background-color: #1A1F2E;
    cursor: not-allowed;
}

.error-text {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 4px;
    margin-bottom: 0;
}

.campo-solo-lectura {
    background-color: #e9ecef;
}
</style>
