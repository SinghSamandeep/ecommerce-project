import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
  }),
  getters: {
    itemCount: (state) => state.items.length,
  },
  actions: {
    addToCart(product) {
      const existingProduct = this.items.find(
        (item) => item._id === product._id
      );
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(productId) {
      const existingProduct = this.items.find((item) => item._id === productId);
      if (existingProduct && existingProduct.quantity > 1) {
        existingProduct.quantity--;
      } else {
        this.items = this.items.filter((item) => item._id !== productId);
      }
    },
  },
});
