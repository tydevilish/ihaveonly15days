<template>
  <div>Dashboard Test</div>

  <button @click="logout" class="bg-red-500 py-2 px-4 text-white rounded-lg">
    ออกจากระบบ
  </button>
</template>

<script setup>
import auth from "~/middleware/auth";
definePageMeta({
  middleware: auth,
});

function logout() {
  localStorage.removeItem("token")
  navigateTo("/login")
}
</script>

<style lang="css"></style>
