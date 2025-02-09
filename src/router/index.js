import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/views/User/Login.vue'
import Register from '@/views/User/Register.vue'
import Layout from '@/views/Layout/index.vue'
import Home from '@/views/Home/index.vue'
import Category from '@/views/Category/index.vue'
import Detail from '@/views/Detail/index.vue'
import SubCategory from '@/views/SubCategory/index.vue'
import CartList from '@/views/CartList/index.vue'
import { useUserStore } from '@/stores/user'
import Search from '@/views/Search/index.vue'
import Checkout from '@/views/Checkout/index.vue'
import Pay from '@/views/Pay/index.vue'
import PaySuccess from '@/views/Pay/PaySuccess.vue'
import Admin from '@/views/Admin/index.vue'
import AdminProduct from '@/views/Admin/components/AdminProduct.vue'
import AdminCategory from '@/views/Admin/components/AdminCategory.vue'
import AdminSubcategory from '@/views/Admin/components/AdminSubcategory.vue'
import ProductAdd from '@/views/Admin/components/Product/ProductAdd.vue'
import ProductDetail from '@/views/Admin/components/Product/ProductDetail.vue'
import Order from '@/views/Order/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/', component: Layout,
      children: [
        { path: '', component: Home, meta: { title: 'Rabbuy - Buy what you want' } },
        { path: 'category/:id', component: Category, meta: { title: 'Rabbuy - Category' } },
        { path: 'category/sub/:id', component: SubCategory, meta: { title: 'Rabbuy - Subcategory ' } },
        { path: 'product/:id', component: Detail, meta: { title: 'product\'s details' } },
        { path: 'cartlist', component: CartList, meta: { title: 'Rabbuy - cartList', requiresUser: true } },
        { path: 'search', component: Search, meta: { title: 'search results' } },
        { path: 'checkout', component: Checkout, meta: { title: 'checkout' }, requiresUser: true },
        { path: 'pay/:id', component: Pay, meta: { title: 'place order', requiresUser: true } },
        { path: 'order', component: Order, meta: { title: 'Rabbuy - Orders', requiresUser: true } },
      ]
    },
    { path: '/pay/success', component: PaySuccess, meta: { title: 'Success' } },

    { path: '/login', component: Login, meta: { title: 'Rabbuy Login' } },

    { path: '/register', component: Register, meta: { title: 'Rabbuy registration' } },

    {
      path: '/admin', redirect: '/admin/product', component: Admin,
      meta: { title: 'Rabbuy admin', requiresAdmin: true },
      children: [
        { path: 'product', component: AdminProduct, },
        { path: 'category', component: AdminCategory },
        { path: 'subcategory', component: AdminSubcategory }
      ]
    },

    { path: '/admin/product/add', component: ProductAdd, meta: { title: 'Add product' } },
    { path: '/admin/product/details/:id', component: ProductDetail, meta: { title: 'Product details' } },
  ],

  scrollBehavior() {
    return {
      top: 0
    }
  }
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title || "Rabbuy";
  document.title = title;

  const userStore = useUserStore()
  const isUser = !!userStore.userInfo.access
  const isAdmin = userStore.userInfo.is_staff

  if (to.meta.requiresUser && !isUser) {
    next({ name: 'Login' })
  } else if (to.meta.requiresAdmin && !isAdmin) {
    alert("This page is for admin only!")
    next('/')
  } else {
    next();
  }
})

export default router