<template>
  <div>
    <div class="flex justify-between">
      <div>
        <div>
          <h1 class="text-3xl">Devices Number : {{ device_id }}</h1>
        </div>
      </div>
      <div class="lg:flex gap-4 grid">
        <button
          @click="isModalOpen = true"
          class="bg-green-500 px-3 py-2 text-white rounded-lg"
        >
          แก้ไขข้อมูล
        </button>

        <button
          @click="disconnectModal = true"
          class="bg-red-500 px-3 py-2 text-white rounded-lg"
        >
          ตัดการเชื่อมต่อ
        </button>
      </div>
    </div>

    <h1 class="text-4xl">ชื่ออุปกรณ์ : {{ device.name }}</h1>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
      <table
        class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="py-3 px-6">Serial Number</th>
            <th scope="col" class="py-3 px-6">Temperature C</th>
            <th scope="col" class="py-3 px-6">Humidity PCT</th>
            <th scope="col" class="py-3 px-6">Reading At</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="item in reading"
            :key="item.reading_id"
            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <th
              scope="row"
              class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {{ item.serial_number }}
            </th>

            <td class="py-4 px-6">
              {{ item.temperature_c }}
            </td>
            <td class="py-4 px-6">
              {{ item.humidity_pct }}
            </td>
            <td class="py-4 px-6">
              {{ item.read_at }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="disconnectModal"
      class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
    >
      <div class="relative w-full max-w-md bg-white p-6 rounded-xl mx-5">
        <div class="flex justify-between">
          <h1 class="text-2xl">ตัดการเชื่อมต่ออุปกรณ์</h1>
          <button @click="disconnectModal = false">
            <i class="mdi mdi-close text-red-500 hover:text-red-600"></i>
          </button>
        </div>

        <p class="text-gray-600">
          คุณแน่ใจหรือไม่ว่าต้องการตัดการเชื่อมต่ออุปกรณ์ชิ้นนี้
        </p>
        <form @submit.prevent="unClaimDeviceById">
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
          <div class="flex justify-end gap-x-3 mt-3">
            <button
              class="bg-gray-200 py-1 px-3 rounded-lg hover:bg-gray-300"
              @click="disconnectModal = false"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="bg-red-500 py-1 px-3 rounded-lg hover:bg-red-600"
            >
              ตกลง
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="w-full max-w-md p-6 bg-white relative rounded-xl mx-5">
        <div class="flex justify-between">
          <h1 class="text-gray-800 text-2xl mb-4">แก้ไขข้อมูลอุปกรณ์</h1>
          <button @click="isModalOpen = false">
            <i
              class="mdi mdi-close text-red-500 hover:text-red-600 transition duration-200"
            ></i>
          </button>
        </div>

        <form @submit.prevent="handleputDeviceById" class="space-y-6">
          <div>
            <label for="newName" class="block text-gray-800 mb-1">
              ชื่ออุปกรณ์
            </label>
            <input
              v-model="form.newName"
              type="text"
              id="newName"
              class="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 border outline-none transition duration-200"
            />
          </div>

          <div>
            <label for="newStatus" class="block text-gray-800 mb-1">
              สถานะอุปกรณ์
            </label>
            <select
              v-model="form.newStatus"
              name="newStatus"
              id="newStatus"
              class="w-full py-2 px-4 rounded-lg focus:ring-2 focus:ring-green-500 border outline-none"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
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

          <div class="flex justify-end gap-x-3">
            <button
              @click="isModalOpen = false"
              class="bg-gray-200 py-1 px-3 rounded-lg hover:bg-gray-300"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              class="bg-green-500 py-1 px-3 rounded-lg hover:bg-green-600"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import axios from "axios";

const route = useRoute();
const device_id = route.params.id;
const config = useRuntimeConfig();
const router = useRouter()

const error = ref("");
const success = ref("");
const device = ref([]);
const isModalOpen = ref(false);
const reading = ref([])
const disconnectModal = ref(false)

const form = ref({
    newName: "",
    newStatus: "",
})

async function getDeviceById() {
  error.value = "";
  success.value = "";

  if (process.client) {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data, status } = await axios.get(
        `${config.public.apiBase}/devices/${device_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (status === 200) {
  device.value = data.data;
  form.value.newName = device.value.name;
  form.value.newStatus = device.value.status;
      }
    } catch (err) {
      console(err);
      error.value = err.response?.data?.message;
    }
  }
}

async function handleputDeviceById() {
    error.value = "";
    success.value = "";

    if(process.client){
    const token = localStorage.getItem("token");
    if (!token) return;
        try {
            const { data , status } = await axios.put(`${config.public.apiBase}/devices/${device_id}`, form.value , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (status === 200) {
                success.value = data.message
                setTimeout(()=>{
                    isModalOpen.value=false
                },2000)
            } else {
                error.value = data.message
            }

        } catch (err) {
            console.log(err)
            error.value = err.response?.data?.message
        }
    }
}

async function getReadings() {
    error.value = ""
    if (process.client) {
    const token = localStorage.getItem("token")
    if (!token) return;
    try{

        const { data , status } = await axios.get(`${config.public.apiBase}/reading/${device_id}` , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (status === 200) {
          reading.value = data.data
        }

    } catch (err) {
        console.log(err)
        error.value = err.response?.data?.message
    }
    }
}

async function unClaimDeviceById() {
  error.value = ""
  success.value = ""
  if (process.client) {
    const token = localStorage.getItem("token")
    if (!token) return;
        try {
            const { data , status } = await axios.put(`${config.public.apiBase}/devices/${device_id}/unclaim`, null , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (status === 200) {
                success.value = data.message
                setTimeout(()=>{
                    disconnectModal.value=false
                    router.push("/dashboard")
                },2000)
            } else {
                error.value = data.message
            }

        } catch (err) {
      console.log(err)
      error.value = err.response?.data?.message
    }
  }
}

onMounted(() => {
  getDeviceById();
  getReadings();
});

definePageMeta({
  layout: "dashboard",
});
</script>
