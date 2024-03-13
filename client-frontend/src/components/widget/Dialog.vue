<template>
  <div>
    <Dialog :visible="showDialog" @hide="hideDialog" modal :closable="false">
      <p>{{ dialogMessage }}</p>
      <template #footer>
        <Button label="OK" @click="hideDialog" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useDialogStore } from '../../store/dialog';

export default {
  components: {
    Dialog,
    Button,
  },
  setup() {
    const dialogStore = useDialogStore();

    const showDialog = computed(() => dialogStore.showDialog);
    const dialogMessage = computed(() => dialogStore.dialogMessage);

    const hideDialog = () => dialogStore.hideDialog();

    return {
      showDialog,
      dialogMessage,
      hideDialog,
    };
  },
};
</script>
