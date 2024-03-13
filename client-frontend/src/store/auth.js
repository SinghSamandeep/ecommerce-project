import { defineStore } from "pinia";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDialogStore } from "./dialog";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    name: "",
    phoneNumber: "",
  }),
  getters: {
    isAuthenticated: (state) => {
      if (!state.token) {
        return false;
      }
      const decoded = jwtDecode(state.token);
      const currentTime = Date.now() / 1000;
      console.log(decoded.exp);
      return decoded.exp > currentTime;
    },
  },
  actions: {
    async login(phoneNumber, password) {
      const dialogStore = useDialogStore();
      try {
        const response = await axios.post(
          `http://localhost:8080/api/users/login?phoneNumber=${encodeURIComponent(
            phoneNumber
          )}&password=${encodeURIComponent(password)}`
        );
        console.log(response.data);
        console.log(response.data.token);
        this.token = response.data.token;
        localStorage.setItem("token", this.token);
        this.name = response.data.name;
        this.phoneNumber = response.data.phoneNumber;
        return true;
      } catch (error) {
        dialogStore.showDialogWithMessage("Wrong Credentials");
        console.error("Error logging in:", error);
        throw error;
      }
    },
    async register(username, name, emailId, phoneNumber, password) {
      try {
        const response = await axios.post(
          "http://localhost:8080/api/users/register",
          {
            username,
            name,
            emailId,
            phoneNumber,
            password,
          }
        );
        this.token = response.data.token;
        this.name = response.data.name;
        this.phoneNumber = response.data.phoneNumber;
        return true;
      } catch (error) {
        console.error("Error registering:", error);
        throw error;
      }
    },
  },
});
