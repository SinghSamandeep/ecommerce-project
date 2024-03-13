<template>
    <div class="container mx-auto p-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg">
        <div class="mb-6 flex">
            <InputText v-model="search" placeholder="Search..."
                class="flex-grow p-3 border-0 rounded-lg focus:ring-4 focus:ring-blue-300 transition-shadow"
                style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);" />
            <Button label="Search" @click="fetchPayments()"
                class="ml-4 bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 active:scale-95 focus:outline-none focus:ring focus:ring-blue-300 transition"
                icon="pi pi-search" />
        </div>
        <DataView :value="payments" layout="list" dataKey="_id">
            <template #list="slotProps">
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
                    <div v-for="(payment, index) in slotProps.items" :key="index"
                        class="bg-white p-5 rounded-lg shadow transition-all hover:scale-105">
                        <div class="flex flex-col gap-3">
                            <div class="text-lg font-semibold text-gray-900">{{ payment.transactionId }}</div>
                            <div class="text-sm text-gray-700">Product ID: {{ payment.productId }}</div>
                            <div class="text-sm text-gray-700">Order Date: {{ payment.orderDate }}</div>
                            <div class="text-sm text-gray-700">Payment Status: {{ payment.paymentStatus }}</div>
                            <div class="text-sm text-gray-700">Order Status: {{ payment.orderStatus }}</div>
                            <div class="text-sm text-gray-700">Price: ${{ payment.price }}</div>
                            <div class="text-sm text-gray-700">Quantity: {{ payment.quantity }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </DataView>

        <Paginator :totalRecords="totalPages * 10" :rows="10" :pageLinkSize="3" @page="onPageChange"
            class="mt-6 bg-white p-4 rounded-lg shadow flex justify-between items-center" />
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePaymentStore } from '../store/payment';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import Paginator from 'primevue/paginator';
import { Payment } from '../store/payment';

const search = ref<string>('');
const paymentStore = usePaymentStore();
const payments = ref<Payment[]>([]);
const totalPages = ref<number>(0);

async function fetchPayments(page: number = 1) {
    console.log(search.value)
    await paymentStore.fetchPayments(search.value, page);
    payments.value = paymentStore.payments;
    totalPages.value = paymentStore.totalPages;
}

function onPageChange(event: { page: number }): void {
    fetchPayments(event.page);
}
onMounted(async () => {
    fetchPayments();
});
</script>
<style>
@keyframes fade-in-up {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
}
</style>