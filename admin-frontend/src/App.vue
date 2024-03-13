<template>
  <div id="app">
    <the-header v-if="isAuth"></the-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <dialog></dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TheHeader from './components/layout/TheHeader.vue';
import Dialog from './components/widget/Dialog.vue';
import { useAuthStore } from './store/auth';
const auth = useAuthStore();
const isAuth = ref<boolean>(false);
onMounted(() => {
  isAuth.value = auth.isAuthenticated;
});
</script>
<style></style>
