<template>
    <section class="card" style="width: 22rem;">
        <div class="card-header">
            <h3>Ingresá a tu cuenta</h3>
        </div>

        <div class="card-body">

            <form novalidate @submit.prevent="enviar">
                <!-- campo nombre -->
                <div class="form-group mb-2">
                    <label for="usuario">Usuario</label>
                    <input id="usuario" 
                        type="text" 
                        class="form-control" 
                        v-model.trim="formData.usuario"
                        @input="formDirty.usuario=true">
                    <!-- cartel validación -->
                    <p v-if="errorUsuario.mostrar" class="error-text my-1">
                        {{ errorUsuario.mensaje }}
                    </p>
                </div>

                <!-- campo apellido -->
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input id="password" 
                        type="password" 
                        class="form-control" 
                        v-model.trim="formData.password"
                        @input="formDirty.password=true">
                    <!-- cartel validación -->
                    <p v-if="errorPassword.mostrar" class="error-text my-1">
                        {{ errorPassword.mensaje }}
                    </p>
                </div>
                <div class="col-12 d-grid">
                    <button class="btn btn-primary my-3" :disabled="estadoBotonDeshabilitado()">Ingresar</button>
                </div>
            </form>
            <div v-if="errorAuth.mostrar" class="alert alert-danger alert-dismissible fade show alert-chico" role="alert">
                {{ errorAuth.mensaje }}
                <button type="button" class="btn-close close-chico" data-bs-dismiss="alert" aria-label="Close" @click="limpiarError()"></button>
            </div>
        </div>
    </section>
</template>

<script>
import { useUserStore } from '@/stores/usuario';

export default {
    name: 'LoginForm', // cambiá el nombre si querés  
    
    components: {

    },
    props: {

    },
    data() {
        return {
            formData: this.getIniciarData(),
            formDirty: this.getIniciarData(),
            userStore: useUserStore(),
            errorMessage: ""
        };
    },
    // Propiedades computadas  
    computed: {
        errorUsuario() {
            this.limpiarError()
            let mensaje = ''
            let usuario = this.formData.usuario
            if(!usuario) mensaje = 'Campo requerido'
            else if(usuario.length < 4) mensaje = 'Debe poseer al menos 4 caracteres'
            else if(usuario.length > 10) mensaje = 'Debe contener como máximo 10 caracteres'
            else if(usuario.includes(' ')) mensaje = 'No se permiten espacios'

            return {
                mensaje: mensaje,
                mostrar: mensaje != '' && this.formDirty.usuario,
                ok: mensaje == ''
            }
        },
        errorPassword() {
            this.limpiarError()
            let mensaje = ''
            let password = this.formData.password
            if(!password) mensaje = 'Campo requerido'
            else if(password.includes(' ')) mensaje = 'No se permiten espacios'
            else if(password.length < 8) mensaje = 'Debe contener 8 caracteres'

            return {
                mensaje: mensaje,
                mostrar: mensaje != '' && this.formDirty.password,
                ok: mensaje == ''
            }
        },
        errorAuth() {
            return {
                mensaje: this.errorMessage,
                mostrar: this.errorMessage != '' && this.errorMessage,
            }
        },

    },

    // Métodos  
    methods: {
        getIniciarData() {
            return {
                usuario: null,
                password: null
               }
        },
        estadoBotonDeshabilitado() {
            return !this.errorUsuario.ok || !this.errorPassword.ok
        },
        async enviar() {
            const datos = { ...this.formData }
            try{

                await this.userStore.login(datos.usuario, datos.password)
                this.$router.push('/principal')
            }catch(error){
               this.errorMessage = error.message
            }
        },
        limpiarError(){
            this.errorMessage = ''
        }
    }

} 
</script>


<style scoped>

.color-btn{
    background-color: #1A1F2E;
}

.error-text {
    color: #dc3545;        
    font-size: 0.85rem;
}

.alert-chico{
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}
.close-chico{
    padding-top: 1rem;
    padding-bottom: 0.5rem;
}
</style>