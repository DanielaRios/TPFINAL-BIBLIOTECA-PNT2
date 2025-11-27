<template>
   <section class="card">
        <div class="card-header text-center">
            <h4>Regístrate</h4>
        </div>
        <div class="card-body">
            <div v-if="errorRegistro.mostrar" class="alert alert-danger alert-dismissible fade show alert-chico" role="alert">
                {{ errorRegistro.mensaje }}
                <button type="button" class="btn-close close-chico" data-bs-dismiss="alert" aria-label="Close" @click="limpiarError()"></button>
            </div>
            <form @submit.prevent="registrar" autocomplete="off">
                <!-- campo nombre -->
                <div class="input-group">
                    <div class="form-group col-6">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre" class="form-control" 
                            v-model.trim="formData.nombre"
                            @input="formDirty.nombre = true"
                        >
                        <p v-if="!formData.nombre && formDirty.nombre" class="error-text mt-1">
                            Campo requerido
                        </p>
                    </div>

                    <!-- campo apellido -->
                    <div class="form-group col-6">
                        <label for="apellido">Apellido</label>
                        <input type="text" id="apellido" class="form-control" 
                            v-model.trim="formData.apellido"
                            @input="formDirty.apellido = true"
                        >
                        <p v-if="!formData.apellido && formDirty.apellido" class="error-text mt-1">
                            Campo requerido
                        </p>
                    </div>
                </div>

                <!-- campo userName -->
                <div class="form-group">
                    <label for="userName">Nombre de usuario</label>
                    <input type="text" id="userName" class="form-control" 
                        v-model.trim="formData.userName"
                        @input="formDirty.userName = true"
                        autocomplete="new-user"
                    >
                    <p v-if="errorUserName.mostrar" class="error-text mt-1">
                        {{ errorUserName.mensaje }}
                    </p>
                </div>

                <!-- campo password -->
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <div class="input-group">
                        <input :type="mostrar ? 'text' : 'password'" class="form-control" 
                        id="password" aria-label="password" aria-describedby="basic-addon2"
                        v-model.trim="formData.password"
                        @input="formDirty.password=true"
                        autocomplete="new-password">
                        <IconEye :type="mostrar ? 'text' : 'password'" @click="mostrar = !mostrar"></IconEye>
                    </div>
                    <!-- <input type="password" id="password" class="form-control" 
                        v-model.trim="formData.password"
                        @input="formDirty.password = true"
                        autocomplete="new-password"
                    > -->
                    <p v-if="errorPassword.mostrar" class="error-text mt-1">
                        {{ errorPassword.mensaje }}
                    </p>

                </div>

                <!-- campo email -->
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" class="form-control" 
                        v-model.trim="formData.email"
                        @input="formDirty.email = true"
                    >
                    <p v-if="errorEmail.mostrar" class="error-text mt-1">
                        {{ errorEmail.mensaje }}
                    </p>
                </div>

                <!-- campo documento -->
                <div class="form-group">
                    <label for="dni">DNI</label>
                    <input type="number" step="any" id="dni" class="form-control" 
                        v-model.number="formData.dni"
                        @input="formDirty.dni = true"
                    >
                    <!-- cartel validación -->
                    <p v-if="errorDNI.mostrar" class="error-text mt-1">
                        {{ errorDNI.mensaje }}
                    </p>
                </div>

                <!-- botón de envío -->
                 <div class="col-12 d-grid">
                <button class="btn btn-success mt-3" :disabled="!validUser">
                    Registrarme</button>
                </div>
            </form>
        </div>
   </section>

</template>

<script>
import { useUserStore } from '@/stores/usuario';
import IconEye from './IconEye.vue';

export default {
    name: 'RegisterForm', // cambiá el nombre si querés  
    
    components: {
        IconEye
    },
    props: {

    },
    data() {
        return {
            formData: this.initNewUser(),
            formDirty: this.initNewUser(),
            userStore: useUserStore(),
            errorMessage: "",
            mostrar: false

        };
    },
    // Propiedades computadas  
    computed: {
        errorUserName() {
            let mensaje = ''
            let nombre = this.formData.userName
            if(!nombre) mensaje = 'Campo requerido'
            else mensaje = this.validarUserName(nombre)

            return {
                mensaje: mensaje,
                mostrar: mensaje != '' && this.formDirty.userName,
                ok: mensaje == ''
            }
        },
        errorEmail() {
            let mensaje = ''
            let email = this.formData.email
            if(!email) mensaje = 'Campo requerido'
            else mensaje = this.validarEmail(email)

            return {
                mensaje: mensaje,
                mostrar: mensaje != '' && this.formDirty.email,
                ok: mensaje == ''
            }
        },
        errorPassword() {
            let mensaje = ''
            let password = this.formData.password
            if(!password) mensaje = 'Campo requerido'
            else mensaje = this.validarPassword(password)

            return {
                mensaje: mensaje,
                mostrar: mensaje != '' && this.formDirty.password,
                ok: mensaje == ''
            }
        },
        errorDNI() {
            let mensaje = ''
            let dni = this.formData.dni
            if(!dni) mensaje = 'Campo requerido'
            else mensaje = this.validarDNI(dni)

            return {
                mensaje: mensaje,
                mostrar: mensaje != '' && this.formDirty.dni,
                ok: mensaje == ''
            }
        },
        validUser(){
            return this.todosCamposValidos() &&
                this.errorUserName.ok &&
                this.errorPassword.ok &&
                this.errorEmail.ok && 
                this.errorDNI.ok

        },
        errorRegistro() {
            return {
                mensaje: this.errorMessage,
                mostrar: this.errorMessage != '' && this.errorMessage,
            }
        },
    },

    // Métodos  
    methods: {
        initNewUser(){
            return {
                nombre: null,
                apellido: null,
                userName: null,
                password: null,
                email: null,
                dni: null
            }
        },
        validarUserName(usName){
            let mensaje = ''
            if(usName.length < 4) mensaje = "Debe contener al menos 4 caracteres"
            return mensaje

        },
        validarPassword(pass){
            let mensaje = ''
            let tieneNumero = /\d/.test(pass) //chequea que tenga algun numero entre 0 yu 9
            if(pass.length < 7) mensaje ="Debe contener al menos 8 caracteres"
            else if(!tieneNumero) mensaje = "Debe contener algun numero"
            else if(pass.includes(" ")) mensaje = "No debe tener espacios"

            return mensaje
        },
        validarEmail(mail){
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            let mensaje = ''
            if(!regex.test(mail)) mensaje = 'Debe ser un email válido'
            return mensaje
        },
        validarDNI(dni){
            let mensaje = ''
            let digitos = String(dni ?? "").length;
            if(digitos != 8) mensaje = "Debe tener 8 digitos"  
            return mensaje

        },
        todosCamposValidos() {
            this.limpiarError()
            return Object.entries(this.formData).filter(e => !e[1]).length === 0
        },
        async registrar(){
            const datos = { ...this.formData }

            try{
                await this.userStore.register(datos)
                this.$router.push('/principal')
            }catch(error){
                this.errorMessage = error.message
            }          
        },
        limpiarError(){
            this.errorMessage = ''
        }
    },
} 
</script>


<style scoped>
.error-text {
    color: #dc3545;        
    font-size: 0.85rem;
    margin-bottom: 0;
}
.card{
    width: 22rem;
}
.alert-chico{
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
}
.close-chico{
    padding-top: 1rem;
    padding-bottom: 0.5rem;
}
</style>