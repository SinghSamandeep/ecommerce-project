<template>
  <div class="Menu">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menubar>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import Menubar from 'primevue/menubar';
import { useCartStore } from '../../store/cart.js';
import { useAuthStore } from '../../store/auth.js';
import { useRouter } from 'vue-router';
const cartStore = useCartStore();
const itemCount = computed(() => cartStore.itemCount);
const router = useRouter();
const authStore = useAuthStore();
console.log("We are in The hEader")
console.log(authStore.isAuthenticated)
const items = computed(() => {
  const menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
      route: { name: 'Home' },
    },
    {
      label: 'Product Search',
      icon: 'pi pi-fw pi-search',
      route: { name: 'ProductSearch' },
    },
    {
      label: `Cart (${itemCount.value})`,
      icon: 'pi pi-fw pi-shopping-cart',
      route: { name: 'CartDetail' },
    }
  ];

  if (authStore.isAuthenticated) {
    menuItems.push({
      label: 'Check Orders',
      icon: 'pi pi-fw pi-list',
      route: { name: 'OrderDetail' },
    });
  } else {
    menuItems.push({
      label: 'Login/Signup',
      icon: 'pi pi-fw pi-user',
      route: { name: 'Login' },
    });
  }

  return menuItems;
});



const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4
  },
  {
    breakpoint: '575px',
    numVisible: 1
  }
]);



function navigateToCart() {
  router.push({ name: 'CartDetail' });
}
</script>

<style scoped>
.cart-icon-wrapper {
  cursor: pointer;
  position: relative;
  display: inline-block;
}

.cart-count {
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0 6px;
  font-size: 0.75rem;
  position: absolute;
  top: -10px;
  right: -10px;
}
</style>