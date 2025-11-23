<template>
    <!-- Modal Editar Libro -->
    <div class="modal fade" id="modalEditarLibro" tabindex="-1" aria-labelledby="modalEditarLibroLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <div class="modal-header modal-header-custom">
                    <h5 class="modal-title" id="modalEditarLibroLabel">
                        Editar Libro
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                        @click="blurCerrar"></button>
                </div>

                <div class="modal-body">
                    <form @submit.prevent="guardarCambiosLibro">

                        <!-- TÍTULO -->
                        <div class="mb-3">
                            <label class="form-label">Título</label>
                            <input type="text" class="form-control" v-model.trim="libro.titulo"
                                @input="libroDirty.titulo = true">
                            <!-- Validación Título -->
                            <p v-if="!libro.titulo && libroDirty.titulo" class="error-text">
                                Campo requerido
                            </p>
                        </div>

                        <!-- AUTOR -->
                        <div class="mb-3">
                            <label class="form-label">Autor</label>
                            <input type="text" class="form-control" v-model.trim="libro.autor"
                                @input="libroDirty.autor = true">
                            <!-- Validación Autor -->
                            <p v-if="!libro.autor && libroDirty.autor" class="error-text">
                                Campo requerido
                            </p>
                        </div>

                        <!-- CATEGORÍA -->
                        <div class="mb-3">
                            <label class="form-label">Categoría</label>

                            <select class="form-select" v-model="libro.categoria" @change="libroDirty.categoria = true">
                                <option value="" disabled>Seleccione una categoría</option>
                                <option v-for="cat in categorias" :key="cat" :value="cat">
                                    {{ cat }}
                                </option>
                            </select>
                            <!-- Validación Categoría
                            <p v-if="!libro.categoria && libroDirty.categoria" class="error-text">
                                Campo requerido
                            </p> -->
                        </div>

                        <div class="row">
                            <!-- AÑO -->
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Año</label>
                                <input type="number" class="form-control" v-model.number="libro.anio"
                                    @input="libroDirty.anio = true" min="1500" max="2025">
                                <!-- Validación Año -->
                                <p v-if="libroDirty.anio && !libro.anio" class="error-text">
                                    Campo requerido
                                </p>
                                <!-- Validación mayor a 1500 -->
                                <p v-else-if="libroDirty.anio && libro.anio < 1500" class="error-text">
                                    El año debe ser mayor o igual a 1500
                                </p>
                                <!-- Validación menor a 2025 -->
                                <p v-else-if="libroDirty.anio && libro.anio > 2025" class="error-text">
                                    El año no puede ser mayor a 2025
                                </p>
                            </div>

                            <!-- STOCK -->
                            <div class="col-md-4 mb-3">
                                <label class="form-label">Stock</label>
                                <input type="number" class="form-control" v-model.number="libro.stock"
                                    @input="libroDirty.stock = true">
                                <!-- Validación Stock -->
                                <p v-if="!libro.stock && libroDirty.stock" class="error-text">
                                    Campo requerido
                                </p>
                            </div>

                            <!-- DISPONIBLE -->
                            <div class="col-md-4 mb-3 d-flex align-items-center">
                                <div class="form-check mt-4">
                                    <input type="checkbox" class="form-check-input" id="chkDisponibleEditar"
                                        v-model="libro.disponibilidad">
                                    <label class="form-check-label" for="chkDisponibleEditar">
                                        Disponible
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- FOTO -->
                        <div class="mb-3">
                            <label class="form-label">URL Foto</label>
                            <input type="text" class="form-control" v-model.trim="libro.foto"
                                @input="libroDirty.foto = true">
                            <p v-if="libroDirty.foto && !libro.foto" class="error-text">
                                Campo requerido
                            </p>
                            <p v-else-if="libroDirty.foto && !esUrlValida(libro.foto)" class="error-text">
                                La URL debe comenzar con "http://" o "https://"
                            </p>
                        </div>

                        <!-- DESCRIPCIÓN -->
                        <div class="mb-3">
                            <label class="form-label">Descripción</label>
                            <textarea class="form-control" rows="3" v-model.trim="libro.descripcion"></textarea>
                        </div>

                        <!-- BOTONES CERRAR Y GUARDAR -->
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-cerrar-modal me-2" data-bs-dismiss="modal"
                                id="btnCerrarModalEditarLibro" @click="blurCerrar">
                                Cerrar
                            </button>
                            <button type="submit" class="btn btn-guardar-modal" :disabled="libroInvalido">
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
import ServicioLibros from '@/Servicios/libros'

export default {
    name: 'AdminEditarLibro',
    props: {
        categorias: Array,
    },
    data() {
        return {
            servicioLibros: new ServicioLibros(),
            libro: this.iniLibro(),
            libroDirty: this.iniLibro()
        }
    },
    computed: {
        libroInvalido() {
            const l = this.libro
            const anioInvalido = !l.anio || l.anio < 1500 || l.anio > 2025
            const fotoInvalida = !l.foto || !this.esUrlValida(l.foto)

            return (
                !l.titulo ||
                !l.autor ||
                !l.categoria ||
                anioInvalido ||
                !l.stock ||
                fotoInvalida
            )
        }
    },

    methods: {
        iniLibro() {
            return {
                id: null,
                titulo: null,
                autor: null,
                categoria: "",
                anio: null,
                stock: null,
                disponibilidad: true,
                foto: null,
                descripcion: null
            }
        },
        // método que llama el padre cuando clickean EDITAR
        cargarLibro(libro) {
            this.libro = { ...libro }
            this.libroDirty = this.iniLibro()
        },
        resetFormulario() {
            this.libro = this.iniLibro()
            this.libroDirty = this.iniLibro()
        },
        async guardarCambiosLibro() {
            const libro = { ...this.libro }
            console.log('Editando libro', libro)

            const libroActualizado = await this.servicioLibros.update(libro.id, libro)

            if (!libroActualizado) {
                alert('No se pudo actualizar el libro en MockAPI')
                return
            }

            // Aviso al padre que se editó un libro
            this.$emit('libro-editado', libroActualizado)

            // Reseteo formulario
            this.resetFormulario()

            // Cierro el modal
            const btnCerrar = document.getElementById('btnCerrarModalEditarLibro')
            if (btnCerrar) btnCerrar.click()
        },
        blurCerrar(event) {
            event.target.blur()
            this.resetFormulario()
        },
        esUrlValida(url) {
            if (!url) return false
            return /^https?:\/\/.+/i.test(url)
        },

    }
}
</script>

<style scoped>
/* Reutilizamos estilos de AdminNuevoLibro */

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
</style>
