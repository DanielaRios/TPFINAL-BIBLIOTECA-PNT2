import ServicioLibros from "@/Servicios/libros";

export default {
    name: 'Admin', // cambiá el nombre si querés  
    
    components: {

    },
    props: {

    },
    data() {
        return {
            servicioLibros: new ServicioLibros(),
            libros: [],

        };
    },
    // Propiedades computadas  
    computed: {

    },

    // Métodos  
    methods: {
        async obtener() {
            const libros = await this.servicioLibros.getAll()
            this.libros = libros
        },
        
    },
     mounted() {
    // se llama automáticamente cuando se monta el componente
    this.obtener();
  },
} 