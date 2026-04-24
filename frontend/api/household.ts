import { BACKEND_URL } from "../config/constant"

export interface houseHoldResponsePayload {
  name: string;
  inviteCode: string;
  members: string[];
  wasteScore: string
}

export interface CreateHouseHoldPayload {
  name: string;
}

export interface CreateHouseHoldResponse {
  houseHold: houseHoldResponsePayload
}

const token: string = localStorage.getItem("token") as string;

export const createHouseHold = async (data: CreateHouseHoldPayload): Promise<CreateHouseHoldResponse> => {
  const res = await fetch(`${BACKEND_URL}/households/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })

  const json = await res.json()

  return json
}

interface joinHouseHoldPayload {
  inviteCode: string
}

export const joinHouseHold = async (data: joinHouseHoldPayload) => {
  const res = await fetch(`${BACKEND_URL}/households/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
}


export const getCurrentUsersHousehold = async () => {
  const res = await fetch(`${BACKEND_URL}/households/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  const json = await res.json()

  return json.houseHold
}

export const listAllMembers = async () => {
  const res = await fetch(`${BACKEND_URL}/households/:id/members`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })

  const json = await res.json()

  return json.result
}
