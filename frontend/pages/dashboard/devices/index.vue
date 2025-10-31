<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div v-if="!devices" class="text-gray-500">
      ไม่พบข้อมูลของอุปกรณ์ในระบบในขณะนี้กรุณาเพิ่มอุปกรณ์
    </div>

    <NuxtLink
      v-for="item in devices"
      :key="item.device_id"
      :to="`/dashboard/devices/${item.device_id}`"
      class="p-8 shadow-lg rounded-lg"
    >
      <p class="text-sm">{{ item.serial_number }}</p>
      <h1 class="text-4xl">{{ item.name }}</h1>
      <h2
        :class="{
          'text-red-500': item.status === 'inactive',
          'text-green-500': item.status === 'active',
        }"
      >
        <i class="mdi mdi-circle-medium"></i>
        {{ item.status }}
      </h2>
      <p class="text-sm text-blue-500">คลิกเพื่อดูรายละเอียด -></p>
    </NuxtLink>
  </div>
</template>

<script setup lang="js">
import axios from "axios";
const config = useRuntimeConfig();
const devices = ref([]);
const error = ref("");

async function getAllDevices() {
  if (process.client) {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.get(`${config.public.apiBase}/devices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      devices.value = data.data;
    } catch (err) {
      console.log(err);
      error.value = err.response?.data?.message;
    }
  }
}

onMounted(() => {
  getAllDevices();
});

definePageMeta({
    layout:"dashboard"
})
</script>
