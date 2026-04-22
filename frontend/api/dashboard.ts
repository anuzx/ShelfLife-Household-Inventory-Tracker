import { BACKEND_URL } from "../config/constant"

const token = localStorage.getItem("token")

export const ItemStatus = async () => {
  const res = await fetch(`${BACKEND_URL}/dashboard/status`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  const json = await res.json()

  return json
}

export const ExpireItem = async () => {
  const res = await fetch(`${BACKEND_URL}/dashboard/expiring`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  const json = await res.json()

  return json.expiringItem
}
