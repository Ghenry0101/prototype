<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue'
import 'leaflet/dist/leaflet.css'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/services/firebase' // atau path sesuai punyamu


let map = ref(null)
const marker = ref(null)

onMounted(async () => {
  if (process.client) {
    const L = await import('leaflet')
    map = L.map('map').setView([-6.2, 106.816666], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    marker.value = L.marker([-6.2, 106.816666]).addTo(map)
      .bindPopup('Jakarta')
  }
  try {
  const testRef = doc(db, 'locations')
  const snapshot = await getDoc(testRef)
  if (snapshot.exists()) {
    console.log('✅ Firebase Firestore Connected. Data:', snapshot.data())
  } else {
    console.log('⚠️ Connected but Document not found.')
  }
} catch (e) {
  console.error('❌ Firestore connection failed:', e)
}

})

// Method ini buat dipanggil dari luar komponen

function setLocation(location) {
  if (!map) return
  marker.value.setLatLng([location.latitude, location.longitude]).bindPopup(location.username)

  map.setView([location.latitude, location.longitude], 16)
}
defineExpose({ setLocation })
</script>