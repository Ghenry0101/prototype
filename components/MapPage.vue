<template>
  <div id="map" style="height: 500px;"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'

onMounted(async () => {
  if (process.client) {
    const L = await import('leaflet')

    const map = L.map('map').setView([-6.2748336,106.9756038], 13)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    L.marker([-6.2748336,106.9756038]).addTo(map)
      .bindPopup('Kantor DNA')
      .openPopup()
  }
})
</script>
