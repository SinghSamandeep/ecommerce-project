import { defineStore } from "pinia";
import axios from "axios";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
  }),
  actions: {
    async fetchProducts() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/fetch"
        ); // Replace with your actual API URL
        this.products = response.data.products;
        console.log(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    },
    async getProductDetails(productId) {
      try {
        console.log("We are in Store" + productId);
        const response = await axios.get(
          `http://localhost:5000/api/products/${productId}`
        );
        console.log(response);
        return response.data;
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        return null;
      }
    },
    async searchProducts(searchText, searchPrice, searchModelNumber, page) {
      try {
        this.loading = true;
        console.log("we are in store");
        let params = {};
        if (searchText) params.text = searchText;
        if (searchPrice) params.price = searchPrice;
        if (searchModelNumber) params.modelNumber = searchModelNumber;
        if (page) params.page = page;
        const response = await axios.get(
          "http://localhost:5000/api/products/search",
          { params }
        );
        console.log(response);
        this.products = response.data.results;
        this.totalProducts = response.data.totalProducts;
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        this.loading = false;
      }
    },
    resetState() {
      this.products = [];
      this.searchText = "";
    },
  },
});
