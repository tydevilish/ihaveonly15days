<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg mx-5 w-full max-w-md">
      <div class="mb-4">
        <h1 class="text-4xl font-bold text-center text-green-600">
          เข้าสู่ระบบ
        </h1>
        <p class="text-center text-xl">
          ยินดีต้อนรับเข้าสู่ระบบ เพื่อดูรายละเอียด
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="usernameOrEmail" class="block text-gray-700 mb-1">
            ชื่อผู้ใช้หรืออีเมล
          </label>
          <input
            v-model="form.usernameOrEmail"
            type="text"
            id="usernameOrEmail"
            class="w-full border py-2 px-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition duration-200"
            placeholder="กรอกชื่อผู้ใช้หรืออีเมล"
          />
        </div>

        <div>
          <label for="password" class="text-gray-700 mb-1 block">
            รหัสผ่าน
          </label>
          <input
            v-model="form.password"
            id="password"
            type="password"
            class="w-full border py-2 px-4 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition duration-200"
            placeholder="กรอกรหัสผ่าน"
          />
        </div>

        <p
          v-if="error"
          class="text-center text-md text-red-500 bg-red-100 py-2 px-3 border border-red-500 rounded-lg"
        >
          {{ error }}
        </p>

        <p
          v-if="success"
          class="text-center text-md text-green-500 bg-green-100 py-2 px-3 border border-green-500 rounded-lg"
        >
          {{ success }}
        </p>

        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
        >
          เข้าสู่ระบบ
        </button>
      </form>
      <p class="mt-4 text-md text-center text-gray-600">
        ยังไม่มีบัญชี?
        <NuxtLink
          to="/register"
          class="text-green-500 hover:underline transition duration-200"
        >
          สมัครสมาชิก
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="js">

import { ref } from 'vue';
import axios from 'axios';
import guest from '~/middleware/guest';

const config = useRuntimeConfig()
const error = ref("");
const success = ref("");

const form = ref({
  usernameOrEmail:"",
  password:""
})

async function handleLogin() {

  error.value = "";
  success.value = "";

  if (!form.value.usernameOrEmail) {
    error.value = "กรุณากรอกชื่อผู้ใช้หรืออีเมล";
    return;
  }

  if (!form.value.password) {
    error.value = "กรุณากรอกรหัสผ่าน";
    return;
  }

  try {
    const { data , status } = await axios.post(`${config.public.apiBase}/auth/login` , form.value)

    if (status === 200) {
      success.value = data.message
      localStorage.setItem("token" , data.token)
      navigateTo("/dashboard")
    }

  } catch (err) {
    console.log(err)
    error.value = err.response?.data?.message;
  }
}

definePageMeta({
  middleware:guest
})
</script>

<style lang="css">
body {
  font-family: "Cordia New", Arial, sans-serif;
  font-size: large;
}
</style>
