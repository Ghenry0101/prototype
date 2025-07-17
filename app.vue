<script setup>
import { onMounted, ref } from 'vue'
import { fetchAllLocations } from './composables/useApi'

const locations = ref([])
const users = ref([])
const mapPageRef = ref(null)

onMounted(async () => {
  const responseData = await fetchAllLocations()
  console.log(responseData)
  users.value = responseData.locations
  locations.value = responseData.locations

  // Ambil hanya username yang tidak kosong
  locations.value = responseData.locations.filter(item => item.username)
  users.value = locations.value.map(item => ({
    username: item.username,
    latitude: item.latitude,
    longitude: item.longitude,
    triggered: true
  }))
})

async function handleClickUser(user) {
  if (!user.latitude || !user.longitude) return
  mapPageRef.value.setLocation(user)
}
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar User List -->
    <div class="w-64 flex flex-col border-r">
      <h2 class="font-bold text-lg p-4 border-b">List User</h2>
      <div class="overflow-auto flex-grow">
        <ul>
          <li 
            v-for="user in users" 
            :key="user.username" 
            @click="handleClickUser(user)"
            class="p-2 cursor-pointer hover:bg-gray-100"
          >
            {{ user.username }}
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
