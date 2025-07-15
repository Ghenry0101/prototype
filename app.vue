<template>
  <div class="flex h-screen">
    <!-- Sidebar User List -->
    <div class="w-64 flex flex-col border-r">
      <h2 class="font-bold text-lg p-4 border-b">List User</h2>
      <div class="overflow-auto flex-grow">
        <ul>
          <li v-for="user in users" :key="user.id" @click="handleClickUser(user)" 
    class="p-2 cursor-pointer hover:bg-gray-100">
    {{ user.username || user.name }}
</li>
        </ul>

      </div>
    </div>

    <!-- Map Area -->
    <div class="flex-grow">
      <MapPage ref="mapPageRef" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { fetchUsers, fetchUserLocationByName, fetchAllLocations } from './composables/useApi.js'


const users = ref([])
const locations = ref([])

onMounted(async () => {
  users.value = await fetchUsers()
  console.log('Users:', users.value) // Log pengguna setelah pengisian
  locations.value = await fetchAllLocations()
})

async function handleClickUser(user) {
  const data = await fetchUserLocationByName(user.username) // atau user.name
  console.log(data)
}


</script>
