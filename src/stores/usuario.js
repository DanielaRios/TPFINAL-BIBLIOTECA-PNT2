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
    normalizarPrestamo(p) {
        const hoy = new Date();
        const fechaPrevista = p.fechaDevolucionPrevista ? new Date(p.fechaDevolucionPrevista) : null;

        let estado;
        if (!p.activo) {
            estado = "Devuelto";
        } else if (fechaPrevista && hoy > fechaPrevista) {
            estado = "Retrasado";
        } else {
            estado = "En Curso";
        }

        return {
            ...p,
            libroID: p.libroID ?? p.libroId,
            estado
        };
    },


    async login(user, pass) {
      const userData = await this.servicioUsuarios.autenticacion(user, pass);
      if (!userData) throw new Error("Credenciales incorrectas");

      const activos = (userData.librosAlquilados ?? [])
        .filter(p => p.activo)
        .map(this.normalizarPrestamo);

      const historial = (userData.librosAlquilados ?? [])
        .filter(p => !p.activo)
        .map(this.normalizarPrestamo);

      this.usuario = {
        ...userData,
        prestamosActivos: activos,
        historialPrestamos: historial
      };
    },

    async register(nuevoUser) {
      const userRegistro = await this.servicioUsuarios.registrar(nuevoUser);
      if (!userRegistro.ok) throw new Error(userRegistro.msg);

      this.usuario = {
        ...userRegistro.data,
        prestamosActivos: [],
        historialPrestamos: []
      };
      return true;
    },

    logout() {
      this.usuario = null;
    },

    async actualizarUsuario(usuarioActualizado) {
        // Usamos Map para quedarnos con un solo objeto por libroID
        const librosMap = new Map();

        (usuarioActualizado.librosAlquilados || []).forEach(p => {
            librosMap.set(p.libroID, p); // si ya existe, lo reemplaza
        });

        const librosAlquiladosLimpios = Array.from(librosMap.values());

        const res = await this.servicioUsuarios.actualizarUsuario({
            ...usuarioActualizado,
            librosAlquilados: librosAlquiladosLimpios
        });
        this.usuario = res

        const activos = (res.data.librosAlquilados ?? [])
            .filter(p => p.activo)
            .map(this.normalizarPrestamo);

        const historial = (res.data.librosAlquilados ?? [])
            .filter(p => !p.activo)
            .map(this.normalizarPrestamo);

        this.usuario = {
            ...res.data,
            prestamosActivos: activos,
            historialPrestamos: historial
        };

        return res;
    }

    


  }
});
