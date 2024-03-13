<template>
    <div class="container mx-auto p-4">
        <DataView :value="products" layout="list" dataKey="_id">
            <template #list="slotProps">
                <ul class="divide-y divide-gray-200 w-full max-w-4xl mx-auto">
                    <li v-for="product in slotProps.items" :key="product._id"
                        class="py-4 hover:bg-gray-50 transition duration-150 flex items-center">
                        <img :src="getImagePath(product.productImages[0])" alt="Product Image"
                            class="flex-none w-32 h-32 object-cover bg-gray-100 rounded-lg shadow-md mr-6" />
                        <div class="flex-1 space-y-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-xl font-semibold text-gray-900">{{ product.name }}</h3>
                                    <span
                                        class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        {{ product.modelNumber }}
                                    </span>
                                </div>
                                <p class="text-lg text-green-600 font-semibold">Rs {{ product.price }}</p>
                            </div>
                            <p class="text-sm text-gray-500 line-clamp-3">
                                {{ getFirstTenWords(product.description) }}...
                            </p>
                            <div class="flex">
                                <button @click="navitageToDetails(product._id)"
                                    class="inline-flex items-center px-4 py-2 text-sm font-medium leading-5 rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-150">
                                    View Details
                                </button>
                                <button @click="deleteProduct(product._id)"
                                    class="ml-3 inline-flex items-center px-4 py-2 text-sm font-medium leading-5 rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition duration-150">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </template>
        </DataView>

        <Paginator :totalRecords="totalProducts" :rows="rows" :pageLinkSize="3" @page="onPage"
            class="py-4 flex justify-center" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataView from 'primevue/dataview';
import Paginator from 'primevue/paginator';
import { useProductsStore } from '../store/products';
import { Product } from '../store/products';
import { useRouter } from 'vue-router';
const rows = 10;
const store = useProductsStore();
const products = ref<Product[]>([]);
const totalProducts = ref(0);
const route = useRouter();
onMounted(async () => {
    await fetchProducts(1);
});

const fetchProducts = async (pageNumber: number) => {
    await store.fetchProducts(pageNumber, rows);
    products.value = store.products;
    totalProducts.value = store.totalProducts;
};

const onPage = (event: { page: number }) => {
    fetchProducts(event.page + 1);
};

function getImagePath(imagePath: string): string {
    return `http://localhost:5000/${imagePath}`;
}

function getFirstTenWords(text: string): string {
    return text.split(/\s+/).slice(0, 10).join(' ');
}

const deleteProduct = async (productId: string) => {
    console.log(productId)
    await store.deleteProduct(productId);
    if (route.currentRoute.value.name === 'ProductList') {
        await route.replace('/temp-route');
        await route.replace({ name: 'ProductList' });
    } else {
        await route.push({ name: 'ProductList' });
    }
}


function navitageToDetails(productId: string): void {
    route.push({ name: 'ProductDetail', params: { id: productId } });
}
</script>
