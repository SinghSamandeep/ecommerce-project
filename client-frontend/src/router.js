import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/Home.vue";
import ProductSearch from "./pages/ProductSearch.vue";
import ProductDetail from "./pages/ProductDetail.vue";
import CartDetail from "./pages/CartDetail.vue";
import Login from "./pages/Login.vue";
import PaymentSuccess from "./pages/PaymentSuccess.vue";
import OrderDetail from "./pages/OrderDetail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/product-search",
    name: "ProductSearch",
    component: ProductSearch,
  },
  {
    path: "/products/:id",
    name: "ProductDetail",
    component: ProductDetail,
  },
  {
    path: "/cart",
    name: "CartDetail",
    component: CartDetail,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    redirect: "/login",
  },
  {
    path: "/payment-success",
    name: "PaymentSuccess",
    component: PaymentSuccess,
  },
  {
    path: "/order-detail",
    name: "OrderDetail",
    component: OrderDetail,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
