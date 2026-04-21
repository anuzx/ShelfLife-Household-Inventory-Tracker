import { BACKEND_URL } from "../config/constant"


const token = localStorage.getItem("token")

export const listHouseholdItems = async () => {
  const res = await fetch(`${BACKEND_URL}/items/`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })

  const json = await res.json()
}

type Category = "produce" | "dairy" | "meat" | "pantry" | "frozen" | "other"

type Status = "fresh" | "expiring-soon" | "expired" | "used" | "wasted"

interface createItemPayload {
  name: string;
  householdId: string;
  addedBy: string;
  category: Category;
  quantity: number;
  expiryDate: string;
  status: Status
}

export const createItem = async (data: createItemPayload) => {
  const res = await fetch(`${BACKEND_URL}/items/`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      data
    })
  })
} 
