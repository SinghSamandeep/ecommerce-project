<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Search and Filter Section -->
    <div class="container mx-auto p-6">
      <div class="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <InputText v-model="searchText" placeholder="Search watches..." class="w-full md:flex-1 p-2 border rounded" />
        <div class="flex flex-col gap-2 w-full md:w-48">
          <InputText v-model="searchPrice" placeholder="Max Price" class="p-2 border rounded" />
          <Slider v-model="searchPrice" :min="100" :max="25000" />
        </div>
        <InputText v-model="searchModelNumber" placeholder="Model Number" class="p-2 border rounded w-full md:w-48" />
        <Button label="Search" @click="fetchResults"
          class="w-full md:w-auto bg-blue-500 hover:bg-blue-700 text-white p-2 rounded" />
      </div>
    </div>

    <!-- Products Grid -->
    <div class="container mx-auto px-4 pb-10">
      <DataView :value="products" layout="grid" @page="onPageChange">
        <template #grid="slotProps">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="product in slotProps.items" :key="product._id"
              class="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-300 p-4">
              <img :src="getImagePath(product.productImages[0])" alt="Product Image"
                class="h-60 w-full object-cover rounded-md" />
              <h3 class="text-lg font-semibold mt-3">{{ product.name }}</h3>
              <p class="text-gray-500">Model: {{ product.modelNumber }}</p>
              <p class="text-green-600 font-bold">₹{{ product.price }}</p>
              <Button label="View" @click="goToProductDetail(product._id)" class="mt-2" />
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
  <div class="card">
    <Paginator :rows="rows" :totalRecords="totalProducts"
      template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" @page="onPageChange" />
  </div>
</template>




<script setup>
import { computed, ref } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Slider from 'primevue/slider';
import Card from 'primevue/card';
import Paginator from 'primevue/paginator';
import DataView from 'primevue/dataview';
import axios from 'axios';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useProductStore } from '../store/product';


const router = useRouter();
const productStore = useProductStore();


const searchText = ref('');
const searchPrice = ref(null);
const searchModelNumber = ref('');
const loading = ref(false);
const totalProducts = ref(0);
const rows = ref(10);

const fetchResults = async (page = 1) => {
  loading.value = true;
  await productStore.searchProducts(searchText.value, searchPrice.value, searchModelNumber.value, page);
  if (productStore.totalProducts) {
    totalProducts.value = productStore.totalProducts;
  }
  loading.value = false;
};

const onPageChange = (event) => {
  localStorage.setItem('currentPage', event.page);
  fetchResults(event.page + 1);
}
const products = computed(() => productStore.products);



function getImagePath(imagePath) {
  const baseUrl = 'http://localhost:5000/';
  console.log(baseUrl + imagePath);
  return baseUrl + imagePath;
}


function goToProductDetail(productId) {
  console.log("Inside Got to detaisl" + productId)
  router.push({ name: 'ProductDetail', params: { id: productId } });
}

</script>
<style scoped>
.search-item {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>