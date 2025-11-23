import { defineStore } from "pinia";
import ServicioUsuarios from "@/Servicios/usuarios";

export const useUserStore = defineStore('usuario', {
    state: () => ({
        usuario: null,
        servicioUsuarios: new ServicioUsuarios(),
    }),
    getters: {
        getUsuario: state => state.usuario,
        getLogeado: state => !!state.usuario,
        getAdmin: state => !!state.usuario?.esAdmin
    },
    actions: {
        async login(user, pass){
            const userData = await this.servicioUsuarios.autenticacion(user, pass)

            if (!userData){
                throw new Error("Credenciales incorrectas")
            }
            this.usuario = userData     
        },
        async register(nuevoUser){
            const userRegistro = await this.servicioUsuarios.registrar(nuevoUser)
            if(!userRegistro.ok){
                throw new Error(userRegistro.msg)
            }
            this.usuario = userRegistro.data
            return true
        },
        logout(){
            this.usuario = null
        }
    }
})