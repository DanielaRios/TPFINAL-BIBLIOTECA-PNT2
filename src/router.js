import { createRouter, createWebHistory } from "vue-router"


// importo los componentes que van a ser las "vistas" de las rutas
import Principal from "./components/Principal.vue"
import Login from "./components/Login/index.vue"
import Admin from "./components/Admin/index.vue"
import User from "./components/User/User.vue"


// configuro las rutas de la barra de navegación
const routes = [
    /* ---- definición de la ruta raíz ---- */
    //{ path: '/', component: Binding },
    { path: '/', redirect: '/principal' },

    /* ---- definición de las rutas activas ---- */

    { path: '/principal', component: Principal },
    { path: '/login', component: Login },
    { path: '/admin', component: Admin },
    { path: '/user', component: User },

    {
      path: "/devolucion-confirmada/:titulo?",
      name: "DevolucionConfirmada",
      component: () => import("@/components/DevolucionConfirmada.vue")
    },

    /* ---- definición de las rutas no existentes ---- */
    { path: '/:pathmatch(.*)*', redirect: '/principal' },
]

// Aca creo variable router para poder usar el enrutador en main.js
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
    scrollBehavior() {
    return { top: 0 }   
  }
})

export default router