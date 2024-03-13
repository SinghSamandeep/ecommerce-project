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

<script setup lang="ts">
import { computed } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import { useDialogStore } from '../../store/dialog';

const dialogStore = useDialogStore();

const showDialog = computed(() => dialogStore.showDialog);
const dialogMessage = computed(() => dialogStore.dialogMessage);

const hideDialog = () => dialogStore.hideDialog();

</script>
