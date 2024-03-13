<template>
  <div id="app">
      <the-header></the-header>
      <router-view />
      <GlobalDialog/>
  </div>
</template>
<script setup>
import TheHeader from './components/layout/TheHeader.vue';
import GlobalDialog from './components/widget/Dialog.vue';

</script>
<style>

</style>
