<template>
    <div class="container mx-auto p-8" v-if="editProduct">
        <div class="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-2xl ">
            <h2 class="text-4xl font-extrabold text-gray-900 mb-10">Edit Product</h2>

            <div class="space-y-6 mb-8">
                <input v-model="editProduct.name" placeholder="Name"
                    class="w-full px-6 py-4 bg-gray-50 text-gray-700 placeholder-gray-400 border-0 rounded-3xl shadow-inner focus:ring-4 focus:ring-indigo-300 transition ease-in-out duration-200" />
                <input v-model="editProduct.modelNumber" placeholder="Model Number"
                    class="w-full px-6 py-4 bg-gray-50 text-gray-700 placeholder-gray-400 border-0 rounded-3xl shadow-inner focus:ring-4 focus:ring-indigo-300 transition ease-in-out duration-200" />
                <input v-model="editProduct.price" placeholder="Price" type="number"
                    class="w-full px-6 py-4 bg-gray-50 text-gray-700 placeholder-gray-400 border-0 rounded-3xl shadow-inner focus:ring-4 focus:ring-indigo-300 transition ease-in-out duration-200" />
                <textarea v-model="editProduct.description" placeholder="Description"
                    class="w-full px-6 py-4 bg-gray-50 text-gray-700 placeholder-gray-400 border-0 rounded-3xl shadow-inner focus:ring-4 focus:ring-indigo-300 transition ease-in-out duration-200"></textarea>
            </div>

            <div class="mb-10">
                <label for="productImages" class="block text-lg font-medium text-gray-800 mb-3">Product Images</label>
                <input id="productImages" type="file" @change="handleImageUpload" multiple accept="image/*" class="file-input w-full text-sm py-2 px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 transition-colors duration-200" />
            </div>

            <div class="flex flex-wrap mb-10 -m-2">
                <div v-for="(image, index) in editProduct.productImages" :key="index" class="p-2 w-1/2 lg:w-1/4">
                    <img :src="getImagePath(image)" alt="Product Image"
                        class="rounded-2xl w-full h-auto shadow-lg transition-transform transform hover:scale-105" />
                    <button @click="deleteImage(index)"
                        class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg mt-3 transition-colors duration-200">
                        Delete
                    </button>
                </div>
            </div>

            <div class="text-center">
                <button @click="updateProduct"
                    class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-3xl transition-colors duration-200">
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '../store/products';
import type { Product } from '../store/products';

const route = useRoute();
const router = useRouter();
const store = useProductsStore();
const editProduct = ref<Product | null>(null);
const newImages = ref<File[]>([]);

onMounted(async () => {
    const product: Product | null = await store.fetchProductDetail(route.params.id as string);
    editProduct.value = product ? structuredClone(product) : null;
});

function getImagePath(imagePath: string): string {
    return imagePath.startsWith('http') ? imagePath : `http://localhost:5000/${imagePath}`;
}

function handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
        newImages.value = Array.from(input.files);
    }
}

function deleteImage(index: number) {
    if (!editProduct.value) return;
    editProduct.value.productImages.splice(index, 1);
}

async function updateProduct() {
    if (!editProduct.value) return;

    const formData = new FormData();
    formData.append('name', editProduct.value.name);
    formData.append('modelNumber', editProduct.value.modelNumber);
    formData.append('price', editProduct.value.price.toString());
    formData.append('description', editProduct.value.description);

    const existingImagesJson = JSON.stringify(editProduct.value.productImages);
    formData.append('existingProductImages', existingImagesJson);

    newImages.value.forEach(file => {
        formData.append('productImages', file);
    });

    await store.updateProduct(route.params.id as string, formData);
    router.push({ name: 'ProductDetail', params: { id: editProduct.value._id } });
}
</script>
