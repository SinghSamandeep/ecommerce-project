<template>
  <div>
    <div v-for="item in cartItems" :key="item._id" class="cart-item">
      <Card style="width: 25rem; overflow: hidden">
        <template #header>
          <img :src="getImagePath(item.productImages[0])" alt="Product Image" class="product-image">
        </template>
        <template #title>{{ item.name }}</template>
        <template #subtitle>${{ item.price }}</template>
        <template #content>
          Quantity: {{ item.quantity }}
        </template>
        <template #footer>
          <Button icon="pi pi-minus" @click="removeFromCart(item._id)" />
        </template>
      </Card>
    </div>
    <div>
      <button @click="promptLoginOrCheckout">CHECKOUT</button>
    </div>
    <Modal v-if="showAuthModal" @close="showAuthModal = false">
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import Card from 'primevue/card';
import Button from 'primevue/button';
import { useCartStore } from '../store/cart';
import { usePaymentStore } from '../store/payment';
import { useAuthStore } from '../store/auth';
import { useRoute } from 'vue-router';

const stripe = Stripe('pk_test_51HAv02BiD8D8U9qJMcrrsdRY4aEs1jaJLP7j6gbFzifNNZCPEhCw2VhyE5IIuYOdI954iRirc07xVf0vv41FLToJ002uBjGJZp')
const route = useRoute();
const authStore = useAuthStore();
const paymentStore = usePaymentStore();
const cartStore = useCartStore();
const cartItems = computed(() => cartStore.items);
const showAuthModal = ref(false);

const getTotalAmount = () => cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0) * 100; // Convert to cents for Stripe


function getImagePath(imagePath) {
  const baseUrl = 'http://localhost:5000/';
  return baseUrl + imagePath;
}

function removeFromCart(productId) {
  cartStore.removeFromCart(productId);
}

function promptLoginOrCheckout() {
  if (!authStore.token) {
    console.log("Not Authenticated")
    showAuthModal.value = true;
  } else {
    handlePayment();
  }
}

async function handlePayment() {
  if (!cartItems.value.length) {
    alert('Your cart is empty.');
    return;
  }

  await paymentStore.createCheckoutSession(cartItems.value);
  console.log(paymentStore.sessionId)
  if (paymentStore.sessionId) {
    await stripe.redirectToCheckout({ sessionId: paymentStore.sessionId });
  }
}

</script>

<style scoped>
.cart-item {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.card-element {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}
</style>
