import { defineStore } from 'pinia';
import ServicioLibros from '@/Servicios/libros';
import { useUserStore } from '@/stores/usuario';

export const useLibrosStore = defineStore('libros', {
  state: () => ({
    lista: [], // Lista de todos los libros
    servicioLibros: new ServicioLibros() // Instancia del servicio para llamar la API
  }),

  actions: {
    // Trae todos los libros desde la API
    async cargarLibros() {
      try {
        this.lista = await this.servicioLibros.getAll();
      } catch (error) {
        console.error("Error al cargar libros:", error);
      }
    },

    // Actualiza el stock de un libro localmente y en la API
    async actualizarStock(id, nuevoStock) {
      const libro = this.lista.find(l => l.id === id);
      if (libro) {
        // Actualiza local
        libro.stock = nuevoStock;

        try {
          // Actualiza en la API
          await this.servicioLibros.update(id, { ...libro, stock: nuevoStock });
        } catch (error) {
          console.error("Error al actualizar stock en la API:", error);
        }
      } else {
        console.warn(`No se encontró el libro con id ${id}`);
      }
    },

    async devolverLibro(id) {
      const libro = this.lista.find(l => l.id === id);
      if (libro) {
        // Incrementar stock local
        libro.stock += 1;

        try {
          // Actualizar stock en la API de libros
          await this.servicioLibros.update(id, { ...libro, stock: libro.stock });

          // 🔑 Actualizar el préstamo en el usuario
          const userStore = useUserStore();
          const user = userStore.usuario;

          const prestamosActualizados = (user.librosAlquilados || []).map(p => {
            if (p.libroID === id && p.activo) {
              return {
                ...p,
                activo: false,
                fechaDevolucion: new Date().toISOString(),
                estado: "Devuelto"
              };
            }
            return p;
          });

          // Guardar cambios en la API de usuarios
          const res = await userStore.servicioUsuarios.actualizarUsuario({
            ...user,
            librosAlquilados: prestamosActualizados
          });

          // Refrescar usuario en el store
          const activos = (res.data.librosAlquilados ?? [])
            .filter(p => p.activo)
            .map(userStore.normalizarPrestamo);

          const historial = (res.data.librosAlquilados ?? [])
            .filter(p => !p.activo)
            .map(userStore.normalizarPrestamo);

          userStore.usuario = {
            ...res.data,
            prestamosActivos: activos,
            historialPrestamos: historial
        };

        } catch (error) {
          console.error("Error al devolver libro en la API:", error);
        }
      } else {
        console.warn(`No se encontró el libro con id ${id}`);
      }
    }




  }
});
