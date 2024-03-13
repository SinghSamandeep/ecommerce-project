import { defineStore } from 'pinia';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Define the product interface based on the given data structure
interface LoginCred {
  emailId: string;
  password: string;
}

interface DecodedToken {
  exp: number;
}

export const useAuthStore = defineStore('auth', {
   state: () => ({
    token: localStorage.getItem("token") || '' as string,
    role: localStorage.getItem("role") || "support" as string
  }),
  getters: {
    isAuthenticated(): boolean {
      if (!this.token) {
        return false;
      }
      const decoded: DecodedToken = jwtDecode<DecodedToken>(this.token);
      const currentTime: number = Date.now() / 1000;
      console.log(currentTime)
      console.log(decoded.exp)
      
      return decoded.exp > currentTime;
    },
  },
  actions: {
     async Login(loginCred:LoginCred) {
      try {
        const response = await axios.post('http://localhost:5000/api/users/login', loginCred);
        // Assuming the response format matches your state, TypeScript will infer the types
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("rolw",response.data.role)
        return true
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
  },

});
