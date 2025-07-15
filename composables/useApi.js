export async function fetchUsers() {
  const res = await fetch('https://a84de938efc1.ngrok-free.app/api/auth/users')
  const json = await res.json()
  console.log('Response JSON:', json)

  // Ambil array dari object 'users'
  const usersArray = Object.values(json.users)
  return usersArray
}


export async function fetchUserLocationByName(username) {
  const res = await fetch(`https://a84de938efc1.ngrok-free.app/api/location/get?username=${username}`, {
    method: 'GET'
  })
  const text = await res.text()
  console.log('Response Text:', text)
  try {
    return JSON.parse(text)
  } catch (error) {
    console.error('Failed to parse JSON:', error)
    return {}
  }
}

export async function fetchAllLocations() {
  const res = await fetch('https://a84de938efc1.ngrok-free.app/api/location/get')
  const json = await res.json()
  console.log('Response JSON:', json)

  return json.locations // Ini array langsung
}

