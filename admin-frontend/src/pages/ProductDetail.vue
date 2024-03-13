<template>
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div v-if="productDetail">
            <h2 class="text-3xl font-bold text-gray-900 mb-4">{{ productDetail.name }}</h2>
            <p class="text-gray-700 mb-6">{{ productDetail.modelNumber }}</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div v-for="(image, index) in productDetail.productImages" :key="index"
                    class="rounded overflow-hidden shadow-lg">
                    <img :src="getImagePath(image)" alt="Product Image" class="w-full" />
                </div>
            </div>

            <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Description</h3>
                <p class="text-gray-700 whitespace-pre-line">{{ productDetail.description }}</p>
            </div>

            <div class="mb-6">
                <h3 class="text-xl font-semibold text-gray-900 mb-2">Price</h3>
                <p class="text-lg text-green-600 font-bold">Rs {{ productDetail.price }}</p>
            </div>

            <router-link :to="{ name: 'EditProduct', params: { id: productDetail._id } }"
                class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Edit Product
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useProductsStore } from '../store/products';
import { Product } from '../store/products';

const route = useRoute();
const store = useProductsStore();
const productDetail = ref<Product>();

onMounted(async () => {
    productDetail.value = await store.fetchProductDetail(route.params.id as string);
});


function getImagePath(imagePath: string): string {
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000/${imagePath}`;

}

</script>
