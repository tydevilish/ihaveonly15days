<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mx-5">
      <div class="mb-4">
        <h2 class="text-4xl font-bold text-center text-green-600">
          สมัครสมาชิก
        </h2>
        <p class="text-center text-xl">สมัครสมาชิกใหม่เพื่อเข้าใช้งานในระบบ</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-1" for="username"
            >ชื่อผู้ใช้</label
          >
          <input
            v-model="form.username"
            type="text"
            id="username"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition duration-200"
            placeholder="กรอกชื่อผู้ใช้"
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1" for="email">อีเมล</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition duration-200"
            placeholder="กรอกอีเมล"
          />
        </div>

        <div class="block md:flex gap-x-4 space-y-4 md:space-y-0">
          <div class="w-full md:w-1/2">
            <label class="block text-gray-700 mb-1" for="password"
              >รหัสผ่าน</label
            >
            <input
              v-model="form.password"
              type="password"
              id="password"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition duration-200"
              placeholder="กรอกรหัสผ่าน"
            />
          </div>

          <div class="w-full md:w-1/2">
            <label class="block text-gray-700 mb-1" for="confirmPassword"
              >ยืนยันรหัสผ่าน</label
            >
            <input
              v-model="form.confirmPassword"
              type="password"
              id="confirmPassword"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition duration-200"
              placeholder="ยืนยันรหัสผ่าน"
            />
          </div>
        </div>

        <p
          v-if="error"
          class="text-red-500 text-md text-center bg-red-100 py-2 rounded-lg border border-red-500"
        >
          {{ error }}
        </p>
        <p
          v-if="success"
          class="text-green-500 text-md text-center bg-green-100 py-2 rounded-lg border border-green-500"
        >
          {{ success }}
        </p>

        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200 transition duration-200"
        >
          สมัครสมาชิก
        </button>
      </form>

      <p class="text-center text-md text-gray-600 mt-4">
        มีบัญชีอยู่แล้ว?
        <NuxtLink
          to="/login"
          class="text-green-600 hover:underline transition duration-200"
        >
          เข้าสู่ระบบ
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="js">

import { ref } from "vue";
import axios from "axios";

const config = useRuntimeConfig();
const error = ref("");
const success = ref("")
const router = useRouter();

const form = ref({
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
});

async function handleRegister() {
  error.value = "";
  success.value = "";

  if (!form.value.username || !form.value.password || !form.value.confirmPassword || !form.value.email) {
    error.value = "กรุณากรอกข้อมูลให้ครบถ้วน"
    return;
}

    if(form.value.username.length < 5) {
        error.value = "ชื่อผู้ใช้ต้องมีอย่างน้อย 5 ตัวอักษร"
        return;
    }

    if(form.value.password.length < 6) {
        error.value = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"
        return;
    }

    if(form.value.password !== form.value.confirmPassword) {
        error.value = "กรุณากรอกรหัสผ่านให้ตรงกัน"
        return;
    }

  try {
    const { data , status } = await axios.post(
      `${config.public.apiBase}/auth/register`,form.value
    );

    if (status === 201) {
        success.value = data.message
        form.value = { username: "", password: "", confirmPassword: "", email: "" };
        setTimeout(() => {
            router.push("/login")
        }, 2000)
    }
  } catch (err) {
    console.log(err)
    error.value = err.response?.data?.message;
  }
}
</script>
