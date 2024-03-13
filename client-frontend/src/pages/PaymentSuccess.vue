<template>
  <div class="payment-success">
    <h1>Payment Successful!</h1>
    <p>Your payment has been processed successfully. Thank you for your purchase!</p>
    <div v-if="paymentStatus === 'verified'">
      <p>Your payment is verified. You will receive your order details shortly.</p>
    </div>
    <div v-else-if="paymentStatus === 'unverified'">
      <p>Verifying your payment...</p>
    </div>
    <div v-else-if="paymentStatus === 'failed'">
      <p>There was a problem verifying your payment. Please contact support.</p>
    </div>
    <button @click="goHome">Go to Homepage</button>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { usePaymentStore } from '../store/payment';
import { useRouter } from 'vue-router';

export default {
  name: 'PaymentSuccess',
  setup() {
    const paymentStore = usePaymentStore();
    const paymentStatus = ref('unverified');
    const router = useRouter();

    const verifyPayment = async (sessionId) => {
      try {
        await paymentStore.verifyPayment(sessionId);
        paymentStatus.value = 'verified';
      } catch (error) {
        console.error('Error verifying payment:', error);
        paymentStatus.value = 'failed';
      }
    };

    const goHome = () => {
      router.push('/');
    };

    onMounted(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      if (sessionId) {
        verifyPayment(sessionId);
      } else {
        paymentStatus.value = 'failed';
      }
    });

    return {
      paymentStatus,
      goHome,
    };
  },
};
</script>

<style>
.payment-success {
  text-align: center;
  padding: 20px;
}

.payment-success h1 {
  color: #4CAF50;
}

button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>
