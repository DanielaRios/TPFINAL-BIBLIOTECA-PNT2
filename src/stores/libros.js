import { defineStore } from 'pinia';
import ServicioLibros from '@/Servicios/libros';

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
    }
  }
});
