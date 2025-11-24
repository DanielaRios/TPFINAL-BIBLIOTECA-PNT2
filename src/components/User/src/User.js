import { useUserStore } from "@/stores/usuario"; // Importa el store de usuario

export default {
  name: 'User',

  data() {
    const userStore = useUserStore(); // Obtenemos el store del usuario



    return {
      userStore,
      // Datos del usuario logueado
      usuarioActualID: userStore.usuario?.id ?? null,
      usuarioActualNombre: userStore.usuario?.nombre ?? '',
      usuarioActualApellido: userStore.usuario?.apellido ?? '',
      

      prestamos: [],       // Array donde guardamos los libros alquilados del usuario
      busqueda: '',        // Texto de búsqueda para filtrar por título o autor
      estadoFiltro: '',    // Filtro por estado: 'En Curso', 'Devuelto', 'Retrasado'
      page: 1,             // Página actual para paginación
      pageSize: 5,          // Cantidad de resultados por página
      modalVisible: false,
      prestamoSeleccionado: null,

      devolucionExitosa: false,
      libroDevuelto: null,

    }
  },

  mounted() {
    // Si no hay usuario logueado, no cargamos nada
    if (!this.usuarioActualID) return;

    // Inicialmente cargamos los préstamos desde el usuario logueado
    this.prestamos = this.userStore.getUsuario?.librosAlquilados ?? [];
  },

  // Observamos cambios en los préstamos del usuario para mantener la vista actualizada
  watch: {
    'userStore.usuario.librosAlquilados': {
      handler(nuevosPrestamos) {
        this.prestamos = nuevosPrestamos ?? [];
      },
      deep: true
    }
  },

  computed: {

    //Filtrado de préstamos por búsqueda y estado
      prestamosConEstado() {
        return this.prestamos.map(p => {
          const hoy = new Date();
          const fechaPrevista = new Date(p.fechaDevolucionPrevista);
          const fechaDevuelta = p.fechaDevolucion ? new Date(p.fechaDevolucion) : null;

          let estado = "En Curso";

          if (fechaDevuelta) {
            estado = "Devuelto";
          } else if (hoy > fechaPrevista) {
            estado = "Retrasado";
          }

          return { ...p, estado };
        });
      },





    // Filtrado de préstamos por búsqueda y estado
    prestamosFiltrados() {
      const q = this.busqueda.trim().toLowerCase();

      return this.prestamosConEstado
        // Aplicamos filtro por estado si hay seleccionado
        .filter(p => (this.estadoFiltro ? p.estado === this.estadoFiltro : true))
        // Aplicamos búsqueda por título o autor
        .filter(p =>
          p.titulo?.toLowerCase().includes(q) ||
          p.autor?.toLowerCase().includes(q)
        );
    },

    // Índice inicial para paginación
    fromIndex() {
      return (this.page - 1) * this.pageSize;
    },

    // Índice final para paginación
    toIndex() {
      return Math.min(this.page * this.pageSize, this.prestamosFiltrados.length);
    },

    // Subarray paginado de préstamos
    prestamosPaginados() {
      return this.prestamosFiltrados.slice(this.fromIndex, this.toIndex);
    }
  },

  methods: {
    // Formateo simple de fechas
    formatDate(fecha) {
      if (!fecha) return '-';
      const d = new Date(fecha);
      return d.toLocaleDateString();
    },

    // Acción de renovar un préstamo (puede implementarse según tu lógica)
    renovar(prestamo) {
      alert(`Renovando préstamo de "${prestamo.titulo}"`);
      // Aquí podrías actualizar la fecha de devolución prevista
    },

    // Ver detalles del préstamo
    verDetalles(prestamo) {
      alert(`Detalles de "${prestamo.titulo}"`);
      // Aquí podrías mostrar un modal con más info o redirigir a otra vista
    },

    // Reemplaza imagen si falla la carga
    imagenError(event) {
      event.target.src = '/default-cover.jpg'; // Portada por defecto
    },
        //NUEVA FUNCIÓN PARA ABRIR EL MODAL
    abrirModalDevolucion(prestamo) {
      this.prestamoSeleccionado = prestamo;
      this.modalVisible = true;
    },

    //CONFIRMAR DEVOLUCIÓN
    confirmarDevolucion() {
      if (!this.prestamoSeleccionado) return;

      const fechaHoy = new Date().toISOString();
      const idPrestamo = this.prestamoSeleccionado.id; // o lo que uses como identificador
      let prestamoActualizado = null; 
      // Buscar índice del préstamo dentro del array del store
      const index = this.userStore.usuario.librosAlquilados.findIndex(
      p => p.id === idPrestamo
    );

    if (index !== -1) {
    // Crear una copia actualizada del préstamo
    prestamoActualizado = {
      ...this.userStore.usuario.librosAlquilados[index],
      fechaDevolucion: fechaHoy
    };


    // Reemplazar el préstamo dentro del array
    const nuevosPrestamos = [...this.userStore.usuario.librosAlquilados];
    nuevosPrestamos[index] = prestamoActualizado;

    this.userStore.usuario.librosAlquilados = nuevosPrestamos;
  }

      // Guardamos el libro para mostrarlo en la animación de éxito
  this.libroDevuelto = prestamoActualizado;

  this.modalVisible = false;


    // Redirige a la pantalla estilo "AlquilerConfirmado"
    this.$router.push({
        name: "DevolucionConfirmada",
        params: {
          titulo: this.libroDevuelto.titulo
        }

      });

  this.prestamoSeleccionado = null;
    

    },

    cancelarDevolucion() {
      this.modalVisible = false;
      this.prestamoSeleccionado = null;
    }


  }
};
