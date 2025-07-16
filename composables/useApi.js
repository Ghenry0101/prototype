
export async function fetchUsers() {
  const res = await fetch('http://localhost:8008/api/auth/users')
  return await res.json()
}

export async function fetchUserLocationByName(username) {
  const res = await fetch(`http://localhost:8008/api/location/get?username=${username}`)
  return await res.json()
}

export async function fetchAllLocations() {
  const res = await fetch('http://localhost:8008/api/location/get')
  return await res.json()
}
