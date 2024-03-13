<template>
  <div v-if="productDetails" class="flex flex-col lg:flex-row h-screen">
    <div class="lg:w-full w-full h-full lg:overflow-auto p-3 flex-3">
      <div class="w-full h-full overflow-auto p-3 flex flex-row flex-nowrap lg:flex-wrap lg:grid lg:grid-cols-2 gap-4">
        <div v-for="(image, index) in productDetails.productImages" :key="index" class="min-w-full lg:min-w-0">
          <img :src="getImageUrl(image)" class="object-cover w-full h-auto rounded-lg shadow bg-gray-100" />
        </div>
      </div>
    </div>
    <div class="lg:w-1/2 w-full bg-white p-5 flex flex-col">
      <h1 class="text-4xl font-semibold mb-2">{{ productDetails.name }}</h1>
      <h2 class="text-2xl text-gray-800 mb-4">Rs {{ productDetails.price }}</h2>

      <Divider />
      <div class="my-4">
        <Badge class="bg-blue-100 text-blue-800 rounded-full px-2 py-1 text-sm">
          <i class="pi pi-check"></i> 5 year Warranty
        </Badge>
        <Badge class="bg-green-100 text-green-800 rounded-full px-2 py-1 text-sm ml-2">
          <i class="pi pi-check"></i> Swiss Made
        </Badge>
      </div>
      <Divider />
      <div class="flex items-center">
        <button @click="addToCart"
          class="bg-black hover:bg-blue-700 text-white transition duration-300 rounded-lg px-4 py-2">
          Add to Cart
        </button>
        <Knob v-model="quantity" :min="1" :max="10" class="ml-4" />
      </div>
      <Divider />

      <p class="text-gray-600 flex-grow">{{ productDetails.description }}</p>

    </div>
  </div>
  <div v-else class="flex justify-center items-center h-screen">
    Loading product details...
  </div>

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../store/product.js';
import { useCartStore } from '../store/cart.js';
import Button from 'primevue/button';
import Knob from 'primevue/knob';
import Divider from 'primevue/divider';
import Badge from 'primevue/badge';

const productStore = useProductStore();
const cartStore = useCartStore();
const route = useRoute();
const productDetails = ref(null);
const mainImageUrl = ref('');
const quantity = ref(1);
const selectedImage = ref(null);



onMounted(async () => {
  productDetails.value = await productStore.getProductDetails(route.params.id);
  if (productDetails.value && productDetails.value.productImages.length > 0) {
    mainImageUrl.value = getImageUrl(productDetails.value.productImages[0]);
  }
});

const getImageUrl = (relativePath) => {
  const baseUrl = 'http://localhost:5000/';
  return baseUrl + relativePath.replace(/\\/g, '/');
};


function addToCart() {
  if (productDetails.value) {
    for (let i = 0; i < quantity.value; i++) {
      cartStore.addToCart(productDetails.value);
    }
  }
}

</script>
<style scoped>
h1,
h2,
p,
button {
  font-family: 'Poppins', sans-serif;
}

/* Enhance button appeal */
button {
  transition: all 0.3s;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
}

.thumbnail {
  border: 2px solid transparent;
}

.thumbnail:hover,
.thumbnail:focus {
  border-color: #10b981;
}
</style>