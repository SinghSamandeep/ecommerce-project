<template>
    <div class="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md hover:shadow-lg transition-shadow duration-300">
        <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">Add Product</h2>
        <form @submit.prevent="submitProduct" class="space-y-6">
            <div class="flex flex-col">
                <label for="name" class="mb-1 font-semibold text-gray-700">Name</label>
                <InputText id="name" v-model="product.name" class="p-inputtext w-full" required />
            </div>
            <div class="flex flex-col">
                <label for="modelNumber" class="mb-1 font-semibold text-gray-700">Model Number</label>
                <InputText id="modelNumber" v-model="product.modelNumber" class="p-inputtext w-full" required />
            </div>
            <div class="flex flex-col">
                <label for="price" class="mb-1 font-semibold text-gray-700">Price</label>
                <InputText id="price" v-model="product.price" class="p-inputtext w-full" required />
            </div>
            <div class="flex flex-col">
                <label for="description" class="mb-1 font-semibold text-gray-700">Description</label>
                <InputText id="description" v-model="product.description" class="p-inputtext w-full" required />
            </div>
            <div class="flex flex-col">
                <label class="font-semibold text-gray-700 mb-1">Upload Images</label>
                <input type="file" multiple accept="image/*" @change="handleImageUpload"
                    class="file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <div class="image-preview mt-2 grid grid-cols-3 gap-2">
                    <img v-for="(src, index) in imagePreviews" :key="index" :src="src"
                        class="rounded-lg shadow-sm max-h-40" />
                </div>
            </div>
            <Button label="Submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white" @click="submitProduct" />
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useProductsStore } from '../store/products';

const product = reactive({
    name: '',
    modelNumber: '',
    price: '',
    description: '',
});

const router = useRouter();
const productsStore = useProductsStore();
const imagePreviews = ref<string[]>([]);
const selectedImages = ref<File[]>([]);


const handleImageUpload = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input && input.files) {
        const files: FileList = input.files;
        imagePreviews.value = Array.from(files).map(file => URL.createObjectURL(file));
        selectedImages.value = Array.from(files);
    }
};

const submitProduct = async () => {
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('modelNumber', product.modelNumber);
    formData.append('price', product.price);
    formData.append('description', product.description);

    selectedImages.value.forEach(file => {
        formData.append('productImages', file);
    });
    console.log(formData)
    await productsStore.addProduct(formData);
    router.push({ name: 'ProductList' });
};
</script>
