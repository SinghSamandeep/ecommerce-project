import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import { useDialogStore } from "./dialog";

export const useOrderStore = defineStore("orders", {
  state: () => ({
    orders: [],
    pagination: {
      pageNumber: 0,
      pageSize: 10,
      totalPages: 1,
      totalElements: 0,
    },
  }),
  actions: {
    async fetchOrders(pageNumber = 0, pageSize = 10) {
      const authStore = useAuthStore();
      const router = useRouter();
      this.error = null;
      try {
        const response = await axios.get(
          `http://localhost:8080/api/order/fetch?page=${pageNumber}&size=${pageSize}`,
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          }
        );
        this.orders = response.data.data.content;
        this.pagination = {
          pageNumber: Number(response.data.data.pageable.pageNumber),
          pageSize: Number(response.data.data.pageable.pageSize),
          totalPages: Number(response.data.data.totalPages),
          totalElements: Number(response.data.data.totalElements),
        };
      } catch (error) {
        this.error = error.response.status;
        const dialogStore = useDialogStore();
        if (error.response.status === 401 || error.response.status === 403) {
          dialogStore.showDialogWithMessage(
            "You have been logged out. Please log in again.",
            () => {
              router.push({ name: "Login" });
            }
          );
        } else if (error.response.status === 500) {
          dialogStore.showDialogWithMessage(
            "Something Went Wrong On Our Side",
            () => {
              router.push({ name: "Home" });
            }
          );
        }
      }
    },
  },
});
