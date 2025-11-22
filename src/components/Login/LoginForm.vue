<template>
    <section class="card" style="width: 20rem;">
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
                    <!-- <input 
                        id="nombre" 
                        type="text" 
                        class="form-control" 
                        v-model.trim="formData.nombre"
                        @input="formDirty.nombre=true"
                    > -->
                    <!-- cartel validación -->
                    <div v-if="errorUsuario.mostrar" class="alert alert-danger my-2">
                        {{ errorUsuario.mensaje }}
                    </div>
                </div>

                <!-- campo apellido -->
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input id="password" 
                        type="password" 
                        class="form-control" 
                        v-model.trim="formData.password"
                        @input="formDirty.password=true">
                    <!-- <input 
                        id="apellido" 
                        type="text" 
                        class="form-control" 
                        v-model.trim="formData.apellido"
                        @input="formDirty.apellido=true"                    
                    > -->
                    <!-- cartel validación -->
                    <div v-if="errorPassword.mostrar" class="alert alert-danger my-2">
                        {{ errorPassword.mensaje }}
                    </div>
                </div>
                <div class="col-12 d-grid">
                    <button class="btn btn-primary my-3" :disabled="estadoBotonDeshabilitado()">Ingresar</button>
                </div>
            </form>
            <div class="alert alert-danger alert-dismissible fade show" role="alert" :hidden="errorAutenticacion()">
                {{ errorMessage }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
            userStore: useUserStore()
        };
    },
    // Propiedades computadas  
    computed: {
        errorUsuario() {
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

    },

    // Métodos  
    methods: {
        getIniciarData() {
            return {
                usuario: null,
                password: null,
                errorMessage: ""
               }
        },
        estadoBotonDeshabilitado() {
            return !this.errorUsuario.ok || !this.errorPassword.ok
        },
        errorAutenticacion(){
            return this.errorMessage !== ""
        },
        async enviar() {
            const datos = { ...this.formData }
            try{

                await this.userStore.login(datos.usuario, datos.password)
                this.$router.push('/principal')
            }catch(e){
               this.errorMessage = e.message
            }
        }
    }

} 
</script>


<style scoped>

.color-btn{
    background-color: #1A1F2E;
}

</style>