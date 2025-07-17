<template>
  <div id="map" style="height: 100vh;"></div>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue'
import 'leaflet/dist/leaflet.css'
import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDz0JFiuq5sYcUUIHRxR_Fb7nNZRGDqdk8",
  authDomain: "locator-dccf6.firebaseapp.com",
  databaseURL: "https://locator-dccf6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "locator-dccf6",
  storageBucket: "locator-dccf6.appspot.com",
  messagingSenderId: "637860668160",
  appId: "1:637860668160:web:b5ec092372e2812f99c9e5",
  measurementId: "G-8CN84BCJCD"
};

// Firebase Init
const app = initializeApp(firebaseConfig);
const db = getDatabase();

let map = ref(null)
const markers = ref({})
let L

onMounted(async () => {
  if (process.client) {
    L = await import('leaflet')
    map.value = L.map('map').setView([-6.2, 106.816666], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.value)

    listenRealtimeLocations()
  }
})

function listenRealtimeLocations() {
  const locationsRef = dbRef(db, 'locations')

  onValue(locationsRef, (snapshot) => {
    const data = snapshot.val()
    if (!data) return

    Object.values(data).forEach(user => {
      updateMarker(user)
    })
  })
}

function updateMarker(user) {
  if (!map.value) return;
  const key = user.username
  if (markers.value[key]) {
    markers.value[key].setLatLng([user.latitude, user.longitude])
  } else {
    markers.value[key] = L.marker([user.latitude, user.longitude])
      .addTo(map.value)
      .bindPopup(user.username)
  }
}

function setLocation(user) {
  if (!map.value) return;
  updateMarker(user)
  map.value.setView([user.latitude, user.longitude], 16)
}

defineExpose({ setLocation, updateMarker })
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
