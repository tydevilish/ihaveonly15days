<template>
  <div>
    <div class="flex justify-end mb-4">
      <button
        class="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition duration-200"
        @click="isModalOpen = true"
      >
        + เพิ่มอุปกรณ์
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="sensor in sensors"
        :key="sensor.id"
        class="bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition"
      >
        <div class="flex gap-x-2">
          <h2 class="text-xl font-bold mb-2">{{ sensor.name }}</h2>
        </div>
        <p class="text-gray-600 text-4xl">
          Temperature : {{ sensor.temperature_c }}
        </p>
        <p class="text-gray-600 text-4xl">
          Humidity: {{ sensor.humidity_pct }}
        </p>
        <span
          :class="{
            'text-green-500': sensor.status === 'active',
            'text-red-500': sensor.status === 'inactive',
          }"
        >
          <i class="mdi mdi-circle-small text-2xl"></i> {{ sensor.status }}
        </span>
        <p class="text-gray-500 text-sm">Updated: {{ sensor.last_seen }}</p>
      </div>

      <div
        v-if="sensors.length === 0"
        class="col-span-full text-center text-gray-500"
      >
        ไม่พบข้อมูลของอุปกรณ์ในระบบ
      </div>
    </div>
  </div>

  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md relative mx-5">
      <div class="flex justify-between">
        <h2 class="text-2xl font-bold mb-4">เพิ่มอุปกรณ์ใหม่</h2>
        <button @click="isModalOpen = false">
          <i
            class="mdi mdi-close text-red-500 hover:text-red-600 transition duration-200"
          ></i>
        </button>
      </div>
      <form @submit.prevent="handleClaim" class="space-y-6">
        <div>
          <label for="serial_number" class="block text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            v-model="form.serial_number"
            type="text"
            class="w-full rounded-lg py-2 px-4 outline-none border focus:ring-2 focus:ring-green-500 transition duration-200"
            placeholder="กรุณากรอก Serial Number"
          />
        </div>
        <div>
          <label for="name" class="block text-gray-700 mb-1">
            ชื่ออุปกรณ์
          </label>
          <input
            v-model="form.name"
            type="text"
            class="w-full rounded-lg py-2 px-4 outline-none border focus:ring-2 focus:ring-green-500 transition duration-200"
            placeholder="กรุณากรอกชื่ออุปกรณ์"
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
        <div class="flex justify-end gap-x-2 mt-4">
          <button
            type="button"
            @click="isModalOpen = false"
            class="text-gray-800 bg-gray-200 rounded-lg px-3 py-1 hover:bg-gray-300 transition duration-200"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            class="bg-green-500 text-gray-800 rounded-lg px-3 py-1 hover:bg-green-600 transition duration-200"
          >
            เพิ่มอุปกรณ์
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="js">
import { ref, onMounted } from "vue";
import axios from "axios";

const config = useRuntimeConfig();
const sensors = ref([]);
let intervalId = null;
const isModalOpen = ref(false);
const error = ref("");
const success = ref("");

const form = ref({
  serial_number: "",
  name: "",
});

async function handleClaim() {
  error.value = "";
  success.value = "";

  if (!form.value.serial_number) {
    error.value = "กรุณากรอก Serial Number";
    return;
  }

  if (!form.value.name) {
    error.value = "กรุณากรอกชื่ออุปกรณ์";
    return;
  }

  if (process.client) {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data , status } = await axios.post(
        `${config.public.apiBase}/devices/claim`,
        form.value,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (status === 200){
        success.value = data.message;
        form.value = { serial_number:"" , name:""}
        setTimeout(()=>{
        isModalOpen.value = false
        },1000)
      }
    } catch (err) {
      console.log(err);
      error.value = err?.response?.data?.message
    }
  }
}

async function readingSensor() {
  if (process.client) {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${config.public.apiBase}/reading/lastest`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      sensors.value = data.data;
    } catch (err) {
      console.error(err);
    }
  }
}

onMounted(() => {
  readingSensor();
  intervalId = setInterval(readingSensor, 4000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

definePageMeta({
  layout: "dashboard",
});
</script>
