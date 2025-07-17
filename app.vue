<script setup>
import { onMounted, ref } from 'vue'
import { fetchAllLocations } from './composables/useApi'
import { db, updateDoc, doc } from './services/firebase'
import { getDoc, onSnapshot, collection } from 'firebase/firestore'

const locations = ref([])
const users = ref([])
const mapPageRef = ref(null)
const activeUser = ref(null)
let intervalId = null

onMounted(async () => {
  const responseData = await fetchAllLocations()
  users.value = responseData.locations.filter(item => item.username)
  locations.value = users.value
  console.log('responseData', responseData)

    try {
  const testRef = doc(db, 'locations', 'dzul')
  const snapshot = await getDoc(testRef)
  if (snapshot.exists()) {
    console.log('✅ Firebase Firestore Connected. Data:', snapshot.data())
  } else {
    console.log('⚠️ Connected but Document not found.')
  }
} catch (e) {
  console.error('❌ Firestore connection failed:', e)
}

  // Ambil hanya username yang tidak kosong
  locations.value = responseData.locations.filter(item => item.username)
  users.value = locations.value.map(item => ({
    username: item.username,
    latitude: item.latitude,
    longitude: item.longitude,
    triggered: item.triggered
  }))


  // ⏰ Otomatis update setiap 5 detik ke user yang terakhir diklik
intervalId = setInterval(async () => {
  if (activeUser.value && mapPageRef.value) {
    const docRef = doc(db, 'locations', activeUser.value.username)
    const snapshot = await getDoc(docRef)
    if (snapshot.exists()) {
      const data = snapshot.data()
      if (data.latitude && data.longitude) {
        const updatedUser = {
          username: data.username,
          latitude: data.latitude,
          longitude: data.longitude,
          triggered: data.triggered
        }
        mapPageRef.value.setLocation(updatedUser)
      } else {
        console.log('Data latitude / longitude kosong:', data)
      }
    }
  }
}, 5000)


})

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId)
})



// 🖱️ Saat klik user, aktifkan user itu
async function handleClickUser(user) {
  try {
    if (!user.latitude || !user.longitude) return
    const docRef = doc(db, 'locations', user.username)
    await updateDoc(docRef, { Triggered: true })
    activeUser.value = user
    mapPageRef.value.setLocation(user)
  } catch (error) {
    console.log('error click', error)
  }
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
