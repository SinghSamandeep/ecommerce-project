import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from './store/auth';
import ProductList from './pages/ProductList.vue';
import AddProduct from './pages/AddProduct.vue';
import Login from './pages/Login.vue';
import ProductDetail from './pages/ProductDetail.vue';
import EditProduct from './pages/EditProduct.vue';
import PaymentDetails from './pages/PaymentDetails.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/productList',
  },
  {
    path: '/productList',
    name: 'ProductList',
    component: ProductList,
  },
  {
    path: '/addProduct',
    name: 'AddProduct',
    component: AddProduct,
  },
   {
    path: '/productDetail/:id',
    name: 'ProductDetail',
    component: ProductDetail,
  },
  {
    path: '/editProduct/:id',
    name: 'EditProduct',
    component: EditProduct,
  },
    {
    path: '/paymentDetails',
    name: 'PaymentDetails',
    component: PaymentDetails,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const auth = useAuthStore();

  if (to.name !== 'Login' && !auth.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    console.log(auth.isAuthenticated)
    console.log(auth.token)
    next();
  }
});

export default router;
