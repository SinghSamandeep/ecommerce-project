<!-- components/OrdersDataView.vue -->
<template>
  <div v-if="orders.length">
    <DataView :value="orders" layout="grid" paginator :rows="10" :totalRecords="pagination.totalElements"
      :rowsPerPageOptions="[10]" @page="onPage">
      <template #grid="slotProps">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          <div v-for="(order, index) in slotProps.items" :key="index"
            class="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-xl">
            <div class="px-5 pt-5 pb-3 bg-gradient-to-r from-gray-900 to-gray-400">
              <h3 class="text-xl font-semibold text-white">{{ order.orderDate }}</h3>
              <p class="text-sm text-gray-200 truncate">{{ order.transactionId }}</p>
            </div>

            <div class="p-5">
              <div class="flex justify-between items-center mb-4">
                <span class="font-medium text-gray-600">Product ID:</span>
                <span class="font-semibold text-gray-900">{{ order.productId }}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="font-medium text-gray-600">Price:</span>
                <span class="text-lg font-semibold text-green-600">Rs {{ order.price }}</span>
              </div>
              <div class="flex justify-between items-center mb-4">
                <span class="font-medium text-gray-600">Quantity:</span>
                <span class="font-semibold text-gray-900">{{ order.quantity }}</span>
              </div>
              <p class="text-sm font-medium text-gray-600 mb-1">Address:</p>
              <p class="text-sm font-semibold text-gray-800">{{ formatAddress(order.address) }}</p>
              <span class="inline-block mt-4 px-3 py-1 text-xs font-semibold rounded-full"
                :class="paymentStatusColor(order.paymentStatus)">
                {{ order.paymentStatus.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>
  <div v-else class="text-center p-10">
    <h3 class="text-lg font-medium text-gray-600">There are No Orders Placed Yet.</h3>
  </div>
</template>


<script setup>
import { onMounted } from 'vue';
import { useOrderStore } from '../store/order';
import DataView from 'primevue/dataview';

const orderStore = useOrderStore();
const orders = orderStore.orders;
const pagination = orderStore.pagination;

const formatAddress = (address) => {
  return `${address.line1}, ${address.city}, ${address.state}, ${address.postalCode}, ${address.country}`;
};

const onPage = (event) => {
  orderStore.fetchOrders(event.page - 1, event.rows);
};

const paymentStatusColor = (status) => {
  if (status === 'paid') return 'bg-green-200 text-green-800';
  if (status === 'pending') return 'bg-yellow-200 text-yellow-800';
  return 'bg-red-200 text-red-800';
};

onMounted(() => {
  orderStore.fetchOrders(0, 10);
});

</script>
