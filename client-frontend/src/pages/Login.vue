<template>
  <div
    class="auth-container max-w-md mx-auto shadow-lg p-8 mt-10 bg-white rounded-lg transform transition-all hover:scale-105">
    <h2 class="text-center font-semibold text-xl mb-6 text-blue-600" v-if="isLoginMode">Login</h2>
    <h2 class="text-center font-semibold text-xl mb-6 text-blue-600" v-else>Sign Up</h2>
    <form @submit.prevent="isLoginMode ? login() : register()" class="space-y-4">
      <div v-if="!isLoginMode">
        <InputText v-model.trim="username" placeholder="Username" class="w-full p-inputtext-sm" />
        <InlineMessage v-show="isSubmitted && !username" severity="error">Username is required</InlineMessage>
      </div>

      <div v-if="!isLoginMode">
        <InputText v-model.trim="name" placeholder="Name" class="w-full p-inputtext-sm" />
        <InlineMessage v-show="isSubmitted && !name" severity="error">Name is required</InlineMessage>
      </div>

      <div v-if="!isLoginMode">
        <InputText v-model.trim="emailId" placeholder="Email" class="w-full p-inputtext-sm" />
        <InlineMessage v-show="isSubmitted && !emailId" severity="error">Email is required</InlineMessage>
      </div>

      <InputText v-model.trim="phoneNumber" placeholder="Phone Number" class="w-full p-inputtext-sm" />
      <InlineMessage v-show="isSubmitted && !phoneNumber" severity="error">Phone number is required</InlineMessage>

      <InputText v-model.trim="password" type="password" placeholder="Password" class="w-full p-inputtext-sm" />
      <InlineMessage v-show="isSubmitted && !password" severity="error">Password is required</InlineMessage>

      <Button :label="isLoginMode ? 'Login' : 'Sign Up'" type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white" />
    </form>
    <Button @click="toggleMode" class="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-blue-600"
      :label="isLoginMode ? 'Switch to Sign Up' : 'Switch to Login'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useDialogStore } from '../store/dialog';
import InlineMessage from 'primevue/inlinemessage';


const router = useRouter();
const authStore = useAuthStore();
const dialogStore = useDialogStore();
const isLoginMode = ref(true);
const username = ref('');
const name = ref('');
const emailId = ref('');
const phoneNumber = ref('');
const password = ref('');
const isSubmitted = ref(false);

function toggleMode() {
  isLoginMode.value = !isLoginMode.value;
}

async function login() {

  isSubmitted.value = true;
  if (phoneNumber.value && password.value) {
    try {
      const success = await authStore.login(phoneNumber.value, password.value);
      console.log(success)
      if (success) {
        router.push({ name: 'Home' });
      }
    } catch (error) {
      console.log(error)
      dialogStore.showDialogWithMessage("Login failed Try Again");
    }
  }

}

async function register() {

  isSubmitted.value = true;
  if (username.value && name.value && emailId.value && phoneNumber.value && password.value) {
    try {
      const success = await authStore.register(username.value, name.value, emailId.value, phoneNumber.value, password.value);
      if (success) {
        router.push({ name: 'Home' });
      }
    } catch (error) {
      dialogStore.showDialogWithMessage("Registration Failed Try Again");
    }
  }

}


</script>

<style scoped>
.auth-container input {
  margin-bottom: 1rem;
}
</style>