import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export interface Product {
  _id: string;
  name: string;
  modelNumber: string;
  productImages: string[];
  price: number;
  description: string;
}

export const useProductsStore = defineStore('products', {
 state: () => ({
    products: [] as Product[],
    totalPages: 0,
    currentPage: 0,
    totalProducts: 0,
  }),
  actions: {
      async fetchProducts(page: number, size: number) {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/fetch?page=${page}&size=${size}`);
        this.products = response.data.products;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.currentPage;
        this.totalProducts = response.data.totalProducts;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
     async addProduct(formData: FormData) {
      console.log(formData)
      try {
        const authStore = useAuthStore();
        const response = await axios.post('http://localhost:5000/api/products/add', formData, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          this.fetchProducts(1,10);
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },
     async fetchProductDetail(id: string) {
       try {
      const authStore = useAuthStore();
      const response = await axios.get(`http://localhost:5000/api/products/${id}`,   
         { headers: {
            Authorization: `Bearer ${authStore.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      return response.data;
    } catch (error) {
      console.error('Error fetching product detail:', error);
    }
    },
  async updateProduct(id: string, formData: FormData) {
  try {
     const authStore = useAuthStore();
    const response = await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
     
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
},
async deleteProduct(id: string) {
  console.log("I am in Delete Product")
  console.log(id)
  try {
     const authStore = useAuthStore();
    const response = await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    });

    if (response.data.success) {
      console.log(response.data.success)
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
}
}});
