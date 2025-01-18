import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/User/Login.vue'
import Register from '@/views/User/Register.vue'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import Category from '@/views/Category/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    { path: '/', component: Layout, children: [
        { path: '', component: Home, meta: { title: 'Rabbuy - Buy what you want' } },
        { path: 'category', component: Category }
      ]
    },

    { path: '/login', component: Login, meta: { title: 'Rabbuy Login' } },

    { path: '/register', component: Register, meta: { title: 'Rabbuy registration' } },
  ],

  scrollBehavior () {
    return {
      top: 0
    }
  },
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title || "Rabbuy";
  document.title = title;
  next();
})

export default router
