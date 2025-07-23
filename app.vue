<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { db } from './services/firebase'
import { onSnapshot, collection, doc, getDoc } from 'firebase/firestore'
import { toggleRealtime } from './composables/useApi' 
import './style.css'


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
    startRealtime(user.username) 
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

watch(is_realtime, async (val) => {
  if (selectedUser.value) {
    if (val) {
      startRealtime(selectedUser.value)
    } else {
      stopRealtime()
      startRealtime() 
    }
    await toggleRealtime(selectedUser.value, val)
  } else {
    if (val) {
      startRealtime()
      await toggleRealtime('admin', true) 
    } else {
      stopRealtime()
      startRealtime() 
    }
  }
})

</script>




<template>
   <div class="container">
    <div class="sidebar">
      <h2>List User</h2>
      <button @click="is_realtime = !is_realtime">
        {{ is_realtime ? '🔴 Realtime ON' : '⚪ Realtime OFF' }}
      </button>
      <div class="user-list">
        <ul>
          <li
            v-for="user in users"
            :key="user.username"
            :class="{ selected: selectedUser === user.username }"
            @click="handleClickUser(user)"
          >
            {{ user.username }}
          </li>
        </ul>
      </div>
    </div>
    <div class="map">
      <MapPage ref="mapPageRef" />
    </div>
  </div>

</template>
