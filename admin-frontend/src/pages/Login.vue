<template>
    <div
        class="auth-container max-w-md mx-auto shadow-xl p-10 mt-16 bg-white rounded-2xl transform transition duration-500 hover:scale-105">
        <h2 class="text-center font-bold text-2xl mb-8 text-blue-700">Login</h2>
        <form @submit.prevent="login()" class="space-y-6">
            <div>
                <label for="emailid" class="text-sm font-medium text-gray-700 block mb-2">Email Id</label>
                <InputText id="emailid" v-model="loginCred.emailId"
                    class="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
                <label for="password" class="text-sm font-medium text-gray-700 block mb-2">Password</label>
                <Password v-model="loginCred.password" toggleMask class="w-full" :feedback="false" />
            </div>
            <Button label="Login" type="submit"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 transition duration-150 ease-in-out" />
        </form>
    </div>
</template>

<script setup lang="ts">
import Password from 'primevue/password';
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';

const router = useRouter();
const authStore = useAuthStore();
const loginCred = reactive({
    emailId: '',
    password: ''
});

async function login() {
    const success = await authStore.Login(loginCred);
    if (success) {
        router.push({ name: 'ProductList' });
    }
}
</script>
