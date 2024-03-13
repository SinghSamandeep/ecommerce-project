import { defineStore } from "pinia";

export const useDialogStore = defineStore("dialog", {
  state: () => ({
    showDialog: false,
    dialogMessage: "",
    onDialogClose: null,
  }),
  actions: {
    showDialogWithMessage(message, onDialogClose = null) {
      this.dialogMessage = message;
      this.showDialog = true;
      this.onDialogClose = onDialogClose;
    },
    hideDialog() {
      if (this.onDialogClose) {
        this.onDialogClose();
        this.onDialogClose = null;
      }
      this.dialogMessage = "";
      this.showDialog = false;
    },
  },
});
