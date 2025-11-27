import LoginForm from "../LoginForm.vue";
import RegisterForm from "../RegisterForm.vue";

export default {

    name: 'Login', // cambiá el nombre si querés  
    
    components: {
        LoginForm,
        RegisterForm
    },
    props: {

    },
    data() {
        return {
            pantallaActual:"login"
        };
    },
    // Propiedades computadas  
    computed: {

    },

    // Métodos  
    methods: {
        
    },
} 