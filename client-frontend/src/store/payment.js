import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import { useDialogStore } from "./dialog";
import { useRouter } from "vue-router";

export const usePaymentStore = defineStore("payment", {
  state: () => ({
    sessionId: "",
    paymentStatus: "",
  }),
  actions: {
    async createCheckoutSession(cartItems) {
      const authStore = useAuthStore();
      const dialogStore = useDialogStore();
      const router = useRouter();
      if (!authStore.isAuthenticated) {
        dialogStore.showDialogWithMessage(
          "You are not Logged In, Login First",
          () => {
            router.push({ name: "Login" });
          }
        );
      }
      try {
        let transformedItems = cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          productId: item._id,
        }));
        const response = await axios.post(
          "http://localhost:8080/api/payment/create-session",
          transformedItems,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        console.log(response);
        this.sessionId = response.data; // Assuming the response directly contains the URL
      } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error; // You might want to handle this more gracefully
      }
    },
    async verifyPayment(sessionId) {
      const authStore = useAuthStore();
      try {
        // Call your backend endpoint to verify payment status
        const response = await axios.get(
          `http://localhost:8080/api/payment/verify-payment/${sessionId}`,
          {
            headers: {
              "x-api-key":
                "sjs6uflh6hja22lo1e7e1if9nkes2f0e2teolvlh5n22tmmlcnc",
            },
          }
        );
        this.paymentStatus = response.data.status;
        // Additional actions based on payment status, e.g., updating UI, user notifications
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    },
  },
});
