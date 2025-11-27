import { useUserStore } from "@/stores/usuario"; // Importa el store de usuario
import { useLibrosStore } from "@/stores/libros";

export default {
  name: 'User',

  data() {
    const userStore = useUserStore(); // Obtenemos el store del usuario
    const librosStore = useLibrosStore();


    return {
      userStore,
      librosStore,

      // Datos del usuario logueado
      usuarioActualID: userStore.usuario?.id ?? null,
      usuarioActualNombre: userStore.usuario?.nombre ?? '',
      usuarioActualApellido: userStore.usuario?.apellido ?? '',
      
      busqueda: '',        // Texto de búsqueda para filtrar por título o autor
      estadoFiltro: '',    // Filtro por estado: 'En Curso', 'Devuelto', 'Retrasado'
      page: 1,             // Página actual para paginación
      pageSize: 5,          // Cantidad de resultados por página
      modalVisible: false,
      prestamoSeleccionado: null,

      devolucionExitosa: false,
      libroDevuelto: null,

    };
  },

  mounted() {
    // Si no hay usuario logueado, no cargamos nada
    if (!this.usuarioActualID) return;
  },


  computed: {
    // Ordenar activos por fecha de alquiler (más reciente primero)
    prestamosActivosOrdenados() {
      return [...(this.userStore.usuario?.prestamosActivos ?? [])]
        .sort((a, b) => new Date(b.fechaAlquiler) - new Date(a.fechaAlquiler));
    },

    // Ordenar historial por fecha de devolución (más reciente primero)
    historialPrestamosOrdenados() {
      return [...(this.userStore.usuario?.historialPrestamos ?? [])]
        .sort((a, b) => new Date(b.fechaDevolucion) - new Date(a.fechaDevolucion));
    },

    // Filtrar activos por búsqueda y estado
    prestamosActivosFiltrados() {
      const q = this.busqueda.trim().toLowerCase();
      return this.prestamosActivosOrdenados.filter(p =>
        (!this.estadoFiltro || p.estado === this.estadoFiltro) &&
        (p.titulo?.toLowerCase().includes(q) || p.autor?.toLowerCase().includes(q))
      );
    },

    // Filtrar historial por búsqueda y estado
    historialPrestamosFiltrados() {
      const q = this.busqueda.trim().toLowerCase();
      return this.historialPrestamosOrdenados.filter(p =>
        (!this.estadoFiltro || p.estado === this.estadoFiltro) &&
        (p.titulo?.toLowerCase().includes(q) || p.autor?.toLowerCase().includes(q))
      );
    },

    // Paginación sobre activos
    prestamosActivosPaginados() {
      const from = (this.page - 1) * this.pageSize;
      const to = Math.min(this.page * this.pageSize, this.prestamosActivosFiltrados.length);
      return this.prestamosActivosFiltrados.slice(from, to);
    },

    // Paginación sobre historial
    historialPrestamosPaginados() {
      const from = (this.page - 1) * this.pageSize;
      const to = Math.min(this.page * this.pageSize, this.historialPrestamosFiltrados.length);
      return this.historialPrestamosFiltrados.slice(from, to);
    },

    totalFiltrados() {
      return this.prestamosActivosFiltrados.length + this.historialPrestamosFiltrados.length;
    },

    fromIndex() {
      return (this.page - 1) * this.pageSize;
    },

    toIndex() {
      return Math.min(this.page * this.pageSize, this.totalFiltrados);
    }
  },


   

  methods: {
    // Formateo fechas
    formatDate(fecha) {
      if (!fecha) return '-';
      const d = new Date(fecha);
      return d.toLocaleDateString();
    },

    
    renovar(prestamo) {
      alert(`Renovando préstamo de "${prestamo.titulo}"`);
    },

    // Ver detalles del préstamo
    verDetalles(prestamo) {
      alert(`Detalles de "${prestamo.titulo}"`);
    },

    
    imagenError(event) {
      event.target.src = '/default-cover.jpg'; // Portada por defecto
    },
      
    abrirModalDevolucion(prestamo) {
      this.prestamoSeleccionado = prestamo;
      this.modalVisible = true;
    },

  // CONFIRMAR DEVOLUCIÓN
  confirmarDevolucion() {
    if (!this.prestamoSeleccionado) return;

    const fechaHoy = new Date().toISOString();

    // Crear objeto actualizado con fecha de devolución
    const prestamoActualizado = {
      ...this.prestamoSeleccionado,
      fechaDevolucion: fechaHoy,
      activo: false,
      estado: "Devuelto"
    };

    // Quitar de activos
    const nuevosActivos = this.userStore.usuario.prestamosActivos.filter(
      p => p.id !== this.prestamoSeleccionado.id
    );

    // Agregar al historial
    const nuevoHistorial = [
      ...this.userStore.usuario.historialPrestamos,
      prestamoActualizado
    ];

    // Actualizar usuario en el store y API
    this.userStore.actualizarUsuario({
      ...this.userStore.usuario,
      prestamosActivos: nuevosActivos,
      historialPrestamos: nuevoHistorial
    }).then(res => {
      

      // Actualizar stock en el catálogo
      this.librosStore.devolverLibro(prestamoActualizado.libroID);

      // Guardar libro para mostrarlo en la animación de éxito
      this.libroDevuelto = prestamoActualizado;
      this.modalVisible = false;

      // Redirigir a la pantalla estilo "DevolucionConfirmada"
      this.$router.push({
        name: "DevolucionConfirmada",
        params: { titulo: this.libroDevuelto.titulo }
      });
    }).catch(err => console.error("Error al devolver:", err));
  },


    cancelarDevolucion() {
      this.modalVisible = false;
      this.prestamoSeleccionado = null;
    }


  }
};
