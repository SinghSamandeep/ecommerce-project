<template>
    <div class="card flex justify-center">
        <Sidebar v-model:visible="visible" position="left" class="w-64 bg-gray-50">
            <ul class="menu-list">
                <li
                    class="menu-item cursor-pointer p-4 hover:bg-gray-100 flex items-center rounded-lg transition-colors duration-200 ease-in-out">
                    <router-link to="/productList" class="flex items-center w-full">
                        <i class="pi pi-fw pi-list mr-4 text-blue-500 text-lg"></i>
                        <span class="text-gray-800 font-medium">Product List</span>
                    </router-link>
                </li>
                <li
                    class="menu-item cursor-pointer p-4 hover:bg-gray-100 flex items-center rounded-lg transition-colors duration-200 ease-in-out">
                    <router-link to="/addProduct" class="flex items-center w-full">
                        <i class="pi pi-fw pi-plus mr-4 text-green-500 text-lg"></i>
                        <span class="text-gray-800 font-medium">Add Product</span>
                    </router-link>
                </li>
                <li
                    class="menu-item cursor-pointer p-4 hover:bg-gray-100 flex items-center rounded-lg transition-colors duration-200 ease-in-out">
                    <router-link to="/paymentDetails" class="flex items-center w-full">
                        <i class="pi pi-fw pi-dollar mr-4 text-red-500 text-lg"></i>
                        <span class="text-gray-800 font-medium">Payment Details</span>
                    </router-link>
                </li>
            </ul>
        </Sidebar>
        <Button icon="pi pi-align-justify" @click="toggleVisible" class="ml-4" />
    </div>
</template>

<script setup lang="ts">
import Sidebar from 'primevue/sidebar';
import Button from 'primevue/button';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const visible = ref(false);
const route = useRoute();

watch(route, () => {
    visible.value = false;
});

function toggleVisible(): void {
    visible.value = !visible.value;
}

</script>

<style>
.menu-list {
    list-style: none;
}

.menu-item {
    transition: background-color 0.3s;
}
</style>
