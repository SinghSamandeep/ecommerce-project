import { defineStore } from 'pinia';

interface DialogState {
  showDialog: boolean;
  dialogMessage: string;
  onDialogClose: (() => void) | null;
}

export const useDialogStore = defineStore('dialog', {
  state: (): DialogState => ({
    showDialog: false,
    dialogMessage: '',
    onDialogClose: null,
  }),
  actions: {
    showDialogWithMessage(message: string, onDialogClose: (() => void) | null = null) {
      this.dialogMessage = message;
      this.showDialog = true;
      this.onDialogClose = onDialogClose;
    },
    hideDialog() {
      if (this.onDialogClose) {
        this.onDialogClose();
        this.onDialogClose = null;
      }
      this.dialogMessage = '';
      this.showDialog = false;
    },
  },
});