<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue'
import 'leaflet/dist/leaflet.css'

let map = null
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
})

// Method ini buat dipanggil dari luar komponen
function moveTo(lat, lng) {
  if (map && marker) {
    map.setView([lat, lng], 10)
    marker.setLatLng([lat, lng])
      .bindPopup(`Lat: ${lat}, Lng: ${lng}`)
      .openPopup()
  }
}


defineExpose({ moveTo })
</script>
