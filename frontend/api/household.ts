import { BACKEND_URL } from "../config/constant"

interface houseHoldResponsePayload {
  name: string;
  inviteCode: string;
  members: string[];
  wasteScore: string
}

interface CreateHouseHoldPayload {
  name: string;
  wasteScore: string
}

interface CreateHouseHoldResponse {
  houseHold: houseHoldResponsePayload
}

const token: string = localStorage.getItem("token") as string;

export const createHouseHold = async (data: CreateHouseHoldPayload): Promise<CreateHouseHoldResponse> => {
  const res = await fetch(`${BACKEND_URL}/houshold/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      data
    })
  })

  const json = await res.json()

  return json.houseHold
}

interface joinHouseHoldPayload {
  inviteCode: string
}

export const joinHouseHold = async (data: joinHouseHoldPayload) => {
  const res = await fetch(`${BACKEND_URL}/household/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      data
    })
  })
}


export const getCurrentUsersHousehold = async () => {
  const res = await fetch(`${BACKEND_URL}/household/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  const json = await res.json()

  return json.houseHold
}

export const listAllMembers = async () => {
  const res = await fetch(`${BACKEND_URL}/household/:id/members`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })

  const json = await res.json()

  return json.result
}
