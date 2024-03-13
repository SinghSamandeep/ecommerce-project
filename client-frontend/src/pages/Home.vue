<template>
  <div class="min-h-screen bg-gray-100">
    <div class="relative overflow-hidden">
      <img src="../assets/Rolex Watc.png" alt="Featured Watch" class="w-full object-cover object-center  lg:h-screen">
    </div>

    <div class="container mx-auto px-4 py-8">
      <h2 class="text-3xl font-semibold text-center mb-10">Recommended</h2>
      <div class="flex flex-wrap justify-center gap-8">
        <div v-for="product in products" :key="product._id"
          class="card bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-500 cursor-pointer"
          @click="goToProductDetail(product._id)" @mouseenter="startAnimation" @mouseleave="stopAnimation">
          <img :src="getImagePath(product.productImages[0])" alt="Watch" class="rounded-t-lg h-40 w-full object-cover">
          <div class="p-4">
            <h3 class="text-xl font-medium">{{ product.name }}</h3>
            <p class="text-gray-600">Model: {{ product.modelNumber }}</p>
            <p class="text-gray-800 font-bold">Price: {{ product.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useProductStore } from '../store/product';
import { onBeforeRouteLeave, useRouter } from 'vue-router';


const store = useProductStore();
const products = ref([]);
const router = useRouter();


onMounted(async () => {
  await store.fetchProducts();
  products.value = store.products;

});

function getImagePath(imagePath) {
  const baseUrl = 'http://localhost:5000/';
  console.log(baseUrl + imagePath);
  return baseUrl + imagePath;
}

onBeforeRouteLeave((to, from) => {
  store.resetState();
});

function goToProductDetail(productId) {
  console.log("Inside Got to detaisl" + productId)
  router.push({ name: 'ProductDetail', params: { id: productId } });
}

</script>

<style scoped></style>