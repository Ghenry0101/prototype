<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { db } from './services/firebase'
import { onSnapshot, collection, doc, getDoc } from 'firebase/firestore'
import { toggleRealtime } from './composables/useApi' // 👈 API CALL

const users = ref([])
const selectedUser = ref(null)
const is_realtime = ref(true)
const mapPageRef = ref(null)

let unsubscribe = null

const startRealtime = (username = null) => {
  stopRealtime()

  if (!username) {
    const colRef = collection(db, 'locations')
    unsubscribe = onSnapshot(colRef, (snapshot) => {
      users.value = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          username: doc.id,
          latitude: data.latitude,
          longitude: data.longitude,
          triggered: data.triggered
        }
      })

      const user = users.value.find(u => u.triggered)
      if (user) mapPageRef.value.setLocation(user)
    })

    console.log('🔥 Realtime connected (ALL)')
  } else {
    const docRef = doc(db, 'locations', username)
unsubscribe = onSnapshot(docRef, (docSnap) => {
  const data = docSnap.data()
  if (!data) return

  const user = {
    username,
    latitude: data.latitude,
    longitude: data.longitude,
    triggered: data.triggered
  }

  // ✅ HAPUS INI
  // users.value = [user]

  // ✅ CUKUP UPDATE MAP
  mapPageRef.value.setLocation(user)
})


    console.log('🔥 Realtime connected (USER)', username)
  }
}

const stopRealtime = () => {
  if (unsubscribe) {
    unsubscribe()
    unsubscribe = null
    console.log('⛔ Realtime stopped')
  }
}

const handleClickUser = async (user) => {
  selectedUser.value = user.username

  if (is_realtime.value) {
    startRealtime(user.username)
    await toggleRealtime(user.username, true)
  } else {
    stopRealtime()
    const docRef = doc(db, 'locations', user.username)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      const u = {
        username: user.username,
        latitude: data.latitude,
        longitude: data.longitude
      }
      users.value = [u]
      mapPageRef.value.setLocation(u)
    }
    await toggleRealtime(user.username, false)
  }
}

// Lifecycle
onMounted(() => {
  startRealtime()
})

onBeforeUnmount(() => {
  stopRealtime()
})

// Toggle realtime watch
watch(is_realtime, async (val) => {
  if (selectedUser.value) {
    if (val) {
      startRealtime(selectedUser.value)
    } else {
      stopRealtime()
    }
    await toggleRealtime(selectedUser.value, val)
  } else {
    if (val) {
      startRealtime()
      await toggleRealtime('admin', true) // fallback
    } else {
      stopRealtime()
    }
  }
})
</script>




<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
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
            :class="[
              'p-2 cursor-pointer hover:bg-gray-100',
              selectedUser === user.username ? 'bg-gray-200 font-bold' : ''
            ]"
          >
            {{ user.username }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Map -->
    <div class="flex-grow">
      <MapPage ref="mapPageRef" />
    </div>
  </div>
</template>
