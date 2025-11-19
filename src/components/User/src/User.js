import axios from 'axios'

export default {
  name: 'User',
  data() {
    return {
      prestamos: [],
      busqueda: '',
      estadoFiltro: '',
      page: 1,
      pageSize: 5
    }
  },
  mounted() {
    axios.get('https://69167fd6a7a34288a27d8066.mockapi.io/api/Libros')
      .then(res => {
        this.prestamos = res.data
      })
      .catch(err => {
        console.error('Error al cargar historial desde la API:', err)
      })
  },



  
  computed: {
    prestamosFiltrados() {
      const q = this.busqueda.trim().toLowerCase()
      return this.prestamos
        .filter(p => (this.estadoFiltro ? p.estado === this.estadoFiltro : true))
        .filter(p => p.titulo.toLowerCase().includes(q) || p.autor.toLowerCase().includes(q))
    },
    fromIndex() {
      return (this.page - 1) * this.pageSize
    },
    toIndex() {
      return Math.min(this.page * this.pageSize, this.prestamosFiltrados.length)
    },
    prestamosPaginados() {
      return this.prestamosFiltrados.slice(this.fromIndex, this.toIndex)
    }
  },
  methods: {
    formatDate(timestamp) {
      if (!timestamp) return 'No disponible'
      const d = new Date(timestamp * 1000) // convertir segundos a milisegundos
      return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })
    },

    
    renovar(p) {
      alert(`Renovaste el préstamo de "${p.titulo}"`)
    },
    verDetalles(p) {
      this.$router.push(`/libro/${p.id}`)
    }
  }
}
