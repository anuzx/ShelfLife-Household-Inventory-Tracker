import { BACKEND_URL } from "../config/constant"


export const ItemStatus = async () => {
  const res = await fetch(`${BACKEND_URL}/dashboard/status`)
  const json = await res.json()

  return json
}

export const ExpireItem = async () => {
  const res = await fetch(`${BACKEND_URL}/dashboard/expiring`)
  const json = await res.json()

  return json.expiringItem
}
