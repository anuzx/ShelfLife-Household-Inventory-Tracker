import { BACKEND_URL } from "../config/constant"

type SignupPayload = {
  name: string;
  email: string;
  password: string
}

type SigninPayload = {
  email: string;
  password: string
}

type SigninResponse = {
  token: string;
};

export const signupUser = async (data: SignupPayload) => {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data
    })
  })
  const json = await res.json()

  return json
}


export const signinUser = async (data: SigninPayload): Promise<SigninResponse> => {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      data
    })
  })

  const json = await res.json()

  return json
}
