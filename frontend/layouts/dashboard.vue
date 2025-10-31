<template>
  <div class="flex h-screen">
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        @click="isSidebarOpen = false"
      ></div>
    </transition>

    <aside
      :class="[
        'fixed z-50 top-0 left-0 h-full w-54 bg-gray-800 text-white flex flex-col transform transition-transform duration-300 md:relative md:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div
        class="flex items-center justify-between px-2 py-1 border-b border-gray-700"
      >
        <div class="text-2xl font-bold">My Dashboard</div>
        <button class="md:hidden" @click="isSidebarOpen = false">✕</button>
      </div>

      <div v-if="user" class="px-2 py-2 border-b border-gray-700">
        <p class="font-semibold">{{ user.username }}</p>
        <p class="text-sm">{{ user.email }}</p>
      </div>
      <div v-else class="p-4 border-b border-gray-700">กำลังโหลดผู้ใช้...</div>

      <nav class="flex-1 mt-5">
        <ul>
          <li>
            <NuxtLink to="/dashboard" class="block py-2 px-4 hover:bg-gray-700"
              >Home</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/dashboard/devices"
              class="block py-2 px-4 hover:bg-gray-700"
              >Devices</NuxtLink
            >
          </li>
        </ul>
      </nav>

      <button
        @click="logout"
        class="bg-red-500 py-2 px-4 m-4 rounded hover:bg-red-600"
      >
        ออกจากระบบ
      </button>
    </aside>

    <main class="flex-1 p-6 overflow-auto">
      <button
        class="md:hidden mb-4 bg-gray-800 text-white px-3 py-1 rounded"
        @click="isSidebarOpen = true"
      >
        <i class="mdi mdi-menu"></i>
      </button>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { navigateTo, useRuntimeConfig } from "#imports";

const config = useRuntimeConfig();
const user = ref(null);
const isSidebarOpen = ref(false);

function logout() {
  localStorage.removeItem("token");
  navigateTo("/login");
}

onMounted(async () => {
  if (process.client) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(`${config.public.apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      user.value = data.data;
    } catch (err) {
      console.error(err);
    }
  }
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
