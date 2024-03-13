import { defineStore } from 'pinia';
import axios from 'axios';

export interface Payment {
  _id: string;
  productId: string;
  transactionId: string;
  orderDate: string;
  paymentStatus: string;
  orderStatus: string;
  customerPhoneNumber: string;
  customerEmailId: string;
  price: number;
  quantity: number;
  address: Array<{
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    _id: string;
  }>;
}

interface PaymentStoreState {
  payments: Payment[];
  totalPages: number;
}

export const usePaymentStore = defineStore('payment', {
  state: (): PaymentStoreState => ({
    payments: [],
    totalPages: 1,
  }),
  actions: {
    async fetchPayments(search: string = '', page: number = 1) {
        console.log("hello we are in fetch Payment")
      try {
        const response = await axios.get('http://localhost:5000/api/payment/fetch-payment', {
          params: { search, page },
        });
        this.payments = response.data.payments;
        this.totalPages = response.data.totalPages;
        console.log(response.data.payments)
        return response.data.payments;
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    },
  },
});