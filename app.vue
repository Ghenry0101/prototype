<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { db } from './services/firebase'
import { onSnapshot, collection, doc } from 'firebase/firestore'

const users = ref([])
const mapPageRef = ref(null)
const is_realtime = ref(true)
let unsubscribe = null


// Bisa buat semua user, bisa buat 1 user
const startRealtime = (username = null) => {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
  }

  if (!username) {
    // 🔴 Semua user
    const colRef = collection(db, 'locations')
    unsubscribe = onSnapshot(colRef, (snapshot) => {
      console.log('🔥 Firestore Realtime Connected (ALL)')
      users.value = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          username: doc.id ?? 'NO USERNAME',
          latitude: data.Latitude,
          longitude: data.Longitude,
          triggered: data.triggered
        }
      }).filter(item => item.username)

      const user = users.value?.find(item => item.triggered)
      if (user && user.latitude && user.longitude) {
        mapPageRef.value.setLocation(user)
      }

      console.log('🔥 Firestore Realtime Updated:', users.value)
    })
  } else {
    // 🔵 1 user spesifik
    const docRef = doc(db, 'locations', username)
    unsubscribe = onSnapshot(docRef, (docSnap) => {
      console.log('🔥 Firestore Realtime Connected (USER)', username)
      const data = docSnap.data()
      if (!data) return
      const user = {
        username: username,
        latitude: data.Latitude,
        longitude: data.Longitude,
        triggered: data.triggered
      }
      users.value = [user]
      mapPageRef.value.setLocation(user)
      console.log('🔥 Firestore Realtime Updated:', user)
    })
  }
}

const stopRealtime = () => {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
    console.log('⛔ Realtime Disabled')
  }
}

onMounted(() => {
  startRealtime() // ✅ default: semua user
})

onBeforeUnmount(() => {
  stopRealtime()
})

watch(is_realtime, (val) => {
  if (val) {
    startRealtime()
  } else {
    stopRealtime()
  }
})

function handleClickUser(user) {
  if (!user.latitude || !user.longitude) return
  stopRealtime()
  startRealtime(user.username)
}

</script>



<template>
  <div class="flex h-screen">
    <!-- Sidebar User List -->
    <div class="w-64 flex flex-col border-r">
      <h2 class="font-bold text-lg p-4 border-b">List User</h2>
      <div class="p-2">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded mb-4"
          @click="is_realtime = !is_realtime"
        >
          {{ is_realtime ? '🔴 Realtime ON' : '⚪ Realtime OFF' }}
        </button>
      </div>
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